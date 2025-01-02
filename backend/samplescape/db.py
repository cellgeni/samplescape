from samplescape.logger import log
from samplescape.config import Settings
from mysql.connector.pooling import MySQLConnectionPool


_connection_pool = MySQLConnectionPool(**Settings.DB_MLWH)


def _get_cnx():
    try:
        return _connection_pool.get_connection()
    except Exception as e:
        raise Exception(f"Error getting database connection: {e}")


def get_studies(
    study_id: int | None = None,
    search: str | None = None,
    programme: list[str] | None = None,
    sponsor: list[str] | None = None,
    release_strategy: list[str] | None = None,
):
    with _get_cnx() as cnx:
        with cnx.cursor(dictionary=True) as cursor:
            sql = """
                SELECT 	study.*
                FROM	mlwarehouse.study AS study
                WHERE 	(study.id_study_lims = %(study_id)s  OR  %(study_id)s IS NULL)
                        AND study.id_lims = 'SQSCP'
                        {filter_clause}
                """

            # additional WHERE clauses start down here
            sql_params = []
            # if query has 'programme' parameters
            if programme:
                programme_sql = []
                for p in programme:
                    programme_sql.append(f" study.programme = '{p}' ")
                sql_params.append(" AND (" + " OR ".join(programme_sql) + " ) ")

            # if query has 'sponsor' parameters
            if sponsor:
                sponsor_sql = []
                for s in sponsor:
                    sponsor_sql.append(f" study.faculty_sponsor = '{s}' ")
                sql_params.append(" AND (" + " OR ".join(sponsor_sql) + " ) ")

            # if query has 'strategy' parameters
            if release_strategy:
                strategy_sql = []
                for rs in release_strategy:
                    strategy_sql.append(f" study.data_release_strategy = '{rs}' ")
                sql_params.append(" AND (" + " OR ".join(strategy_sql) + " ) ")

            # if query has 'search' parameter
            search_fields = [
                "study.name",
                "study.abbreviation",
                "study.study_title",
            ]
            if search:
                search_sql = []
                for field in search_fields:
                    search_sql.append(f" {field} like '{search}%' ")
                sql_params.append(" AND (" + " OR ".join(search_sql) + " ) ")

            sql = sql.format(filter_clause="\n".join(sql_params))

            log.debug(sql)

            cursor.execute(
                sql,
                {"study_id": study_id},
            )
            return cursor.fetchall()


def get_sponsors():
    with _get_cnx() as cnx:
        with cnx.cursor(dictionary=True) as cursor:
            cursor.execute(
                """
                SELECT 	DISTINCT study.faculty_sponsor
                FROM	mlwarehouse.study AS study
                WHERE 	study.id_lims = 'SQSCP'
                        AND study.faculty_sponsor IS NOT NULL
                """,
            )
            return cursor.fetchall()


def get_programmes():
    with _get_cnx() as cnx:
        with cnx.cursor(dictionary=True) as cursor:
            cursor.execute(
                """
                SELECT 	DISTINCT study.programme
                FROM	mlwarehouse.study AS study
                WHERE 	study.id_lims = 'SQSCP'
                        AND study.programme IS NOT NULL
                """,
            )
            return cursor.fetchall()


def get_release_strategies():
    with _get_cnx() as cnx:
        with cnx.cursor(dictionary=True) as cursor:
            cursor.execute(
                """
                SELECT 	DISTINCT study.data_release_strategy
                FROM	mlwarehouse.study AS study
                WHERE 	study.id_lims = 'SQSCP'
                        AND study.data_release_strategy IS NOT NULL
                """,
            )
            return cursor.fetchall()


def get_samples(
    search: str | None = None,
    study_id: int | None = None,
    sample_id: int | None = None,
):

    if not (search or study_id or sample_id):
        return {}

    sql = """
        SELECT  study.id_study_tmp,
                study.id_study_lims,
                study.abbreviation AS study_abbreviation,
                study.data_release_strategy AS study_release_strategy,
                study.hmdmc_number as study_hmdmc_number,
                sample.id_sample_tmp,
                sample.id_sample_lims,
                sample.sanger_sample_id,
                sample.last_updated,
                sample.name as sample_name,
                sample.description,
                sample.supplier_name,
                sample.reference_genome,
                sample.donor_id,
                sample.sample_type,
                sample.organism

        FROM    mlwarehouse.sample,
                mlwarehouse.iseq_flowcell AS flowcell, 
                mlwarehouse.study

        WHERE 	(study.id_study_lims = %(study_id)s OR %(study_id)s IS NULL)
                AND (sample.id_sample_lims = %(sample_id)s OR %(sample_id)s IS NULL)
                AND study.id_lims = 'SQSCP'
                AND flowcell.id_sample_tmp = sample.id_sample_tmp
                AND flowcell.id_study_tmp = study.id_study_tmp
                {filter_clause}

        GROUP BY study.id_study_tmp,sample.id_sample_tmp
    """

    # additional WHERE clauses
    sql_params = []
    search_fields = [
        "sample.name",
        "sample.sanger_sample_id",
        "sample.supplier_name",
    ]
    # if query has 'programme' parameters
    if search:
        search_sql = []
        for field in search_fields:
            search_sql.append(f" {field} like '{search}%' ")
        sql_params.append(" AND (" + " OR ".join(search_sql) + " ) ")

    sql = sql.format(filter_clause="\n".join(sql_params))

    log.debug(sql)

    with _get_cnx() as cnx:
        with cnx.cursor(dictionary=True) as cursor:
            cursor.execute(
                sql,
                {"study_id": study_id, "sample_id": sample_id},
            )
            return cursor.fetchall()


def get_sample(sample_id: int):
    sql = """
    SELECT	study.id_study_tmp,
            study.name as study_name,
            study.abbreviation as study_abbreviation,
            sample.*,
            product_metrics.id_run,
            flowcell.position,
            flowcell.tag_index,
            run_status_dict.description AS run_description,
            run_status.date as run_date,
            (
            SELECT  CONCAT(TRIM(TRAILING "/" FROM irods.irods_root_collection), "/", irods.irods_data_relative_path)
            FROM    mlwarehouse.seq_product_irods_locations AS irods
            WHERE   irods.id_product = product_metrics.id_iseq_product
            ) AS irods_path
    FROM	mlwarehouse.study,
            mlwarehouse.sample,
            mlwarehouse.iseq_flowcell AS flowcell,
            mlwarehouse.iseq_product_metrics AS product_metrics,
            mlwarehouse.iseq_run_status AS run_status,
            mlwarehouse.iseq_run_status_dict AS run_status_dict
    WHERE	sample.id_lims = 'SQSCP' 
            AND sample.id_sample_tmp = %(sample_id)s
            AND sample.id_sample_tmp = flowcell.id_sample_tmp
            AND study.id_study_tmp = flowcell.id_study_tmp
            AND product_metrics.id_iseq_flowcell_tmp = flowcell.id_iseq_flowcell_tmp
            AND run_status.id_run_status_dict = run_status_dict.id_run_status_dict
            AND run_status.id_run = product_metrics.id_run
            AND run_status.iscurrent = 1
    ORDER BY id_run, position, tag_index
    """
    log.debug(sql)
    log.debug(sample_id)

    with _get_cnx() as cnx:
        with cnx.cursor(dictionary=True) as cursor:
            cursor.execute(
                sql,
                {"sample_id": sample_id},
            )
            return cursor.fetchall()
