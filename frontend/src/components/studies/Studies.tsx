import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Tag, Divider, Tooltip, Button } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { AppstoreAddOutlined } from '@ant-design/icons';
import ProgrammeSelect from './ProgrammeSelect';
import SponsorSelect from './SponsorSelect';
import TextSearch from './TextSearch';
import API from '../../API';
import StudyDetails from './StudyDetails';
import TableExporter from '../etc/TableExporter';
import ReleaseStrategySelect from './ReleaseStrategySelect';
import Link from 'antd/es/typography/Link';


const Studies: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => <Tag>Total {total} items</Tag>
    });

    const [filters, setFilters] = useState({
        search: '',
        sponsor: [],
        programme: ['Cellular Genomics'],
        release_strategy: [],
    });

    var fetchtches = 0;

    // helper to set individual filters in other componets
    const updateFilter = (filterName: keyof typeof filters, values: string | string[]) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: values,
        }));
    };


    // Fetch data from server
    const fetchData = async (params: {
        pagination: TablePaginationConfig;
        filters: {
            search: string;
            programme: string[],
            sponsor: string[],
            release_strategy: string[],
        };
    }) => {
        setLoading(true);

        try {
            const { pagination, filters } = params;
            // get everything and the paginate on client
            const response = await API.get('/studies', {
                params: filters //pagination should be there too
            });

            const transformedData = response.data.studies.map((study: any) => ({
                key: `study_${study.id_study_tmp.toString()}`,
                study: study
            }));
            const total = transformedData.length;

            setData(transformedData);
            // Update total number of records from server
            setPagination({ ...pagination, total });
        } catch (error) {
            console.error('Error fetching data:', error);
        }

        setLoading(false);
    };


    // Initial data fetch
    useEffect(() => {
        console.log(`firing fetch stduies ${fetchtches++}`);
        fetchData({ pagination, filters, });
    }, [pagination.current, pagination.pageSize, filters]);


    // Handle table change (pagination, sorting)
    const handleTableChange = (
        newPagination: TablePaginationConfig,
        _: Record<string, FilterValue | null>,
        __: SorterResult<any> | SorterResult<any>[]
    ) => {
        setPagination(newPagination);
    };


    const columns: ColumnsType<any> = [
        {
            title: 'ID',
            dataIndex: ['study', 'id_study_lims'],
            sorter: true,
            render: (_, row) => {
                return (
                    <Tooltip title="View samples for this study">
                        <Link href={`/samples/?study_id=${row.study.id_study_lims}`}>
                            <Button size="small" icon={<AppstoreAddOutlined />} iconPosition="end">{row.study.id_study_lims}</Button>
                        </Link>
                    </Tooltip>
                );
            }
        },
        {
            title: 'Abbrev.',
            dataIndex: ['study', 'abbreviation'],
            sorter: true,
        },
        {
            title: 'State',
            dataIndex: ['study', 'state'],
            sorter: (a, b) => a.study.state - b.study.state,
        },
        {
            title: 'Release strategy',
            dataIndex: ['study', 'data_release_strategy'],
            sorter: (a, b) => a.study.data_release_strategy.localeCompare(b.study.data_release_strategy),
            render: (text, _) => {
                let color = 'purple'
                if (text == 'open') {
                    color = 'green';
                } else if (text == 'managed') {
                    color = 'volcano';
                }
                return (
                    <Tag bordered={false} color={color} key={text}>
                        {text}
                    </Tag>
                );
            }
        },
        {
            title: 'Sponsor',
            dataIndex: ['study', 'faculty_sponsor'],
            sorter: (a, b) => a.study.faculty_sponsor.localeCompare(b.study.faculty_sponsor),
        },
        {
            title: 'Release timing',
            dataIndex: ['study', 'data_release_timing'],
            sorter: (a, b) => a.study.data_release_timing.localeCompare(b.study.data_release_timing),
        },
        {
            title: 'Access group',
            dataIndex: ['study', 'data_access_group'],
            // render: (text, row) => {
            //     if (row.study.data_access_group) {
            //         return <Typography.Paragraph ellipsis={{ rows: 2, expandable: true }}>{row.study.data_access_group}</Typography.Paragraph>
            //     }
            // },
        },
        {
            title: 'HMDMC',
            dataIndex: ['study', 'hmdmc_number'],
        },
        {
            title: 'Last updated',
            dataIndex: ['study', 'last_updated'],
            sorter: (a, b) => a.study.last_updated - b.study.last_updated,
        },
    ];

    return (
        <Row>
            {/* Filter Panel */}
            <Col span={4}>
                <div style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                    <Divider orientation="left">Filters</Divider>
                    <TextSearch selectedValues={filters.search} setSelectedValues={(values) => updateFilter('search', values)} />
                    <ProgrammeSelect selectedValues={filters.programme} setSelectedValues={(values) => updateFilter('programme', values)} />
                    <SponsorSelect setSelectedValues={(values) => updateFilter('sponsor', values)} />
                    < ReleaseStrategySelect setSelectedValues={(values) => updateFilter('release_strategy', values)} />
                </div>
            </Col>

            {/* Table */}
            <Col span={20}>
                <TableExporter filename={"studies"} data={data.map((d) => d.study)} />
                <Table
                    columns={columns}
                    rowKey={(record) => record.key}
                    dataSource={data}
                    pagination={pagination}
                    loading={loading}
                    scroll={{ x: 400 }}
                    size="small"
                    bordered={true}
                    onChange={handleTableChange}
                    expandable={{
                        expandedRowRender: row => (<StudyDetails study={row.study} />)
                    }}
                />
            </Col>
        </Row>
    );
};

export default Studies;
