import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Divider, Tooltip } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import API from '../../API';
import TableExporter from '../etc/TableExporter';
import TextSearch from './TextSearch';
import StudySelect from './StudySelect';
import { useSearchParams } from 'react-router-dom';
import SortText from '../etc/TableFunctions';
import SampleDetails from './SampleDetails';

const Samples: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, _] = useSearchParams();

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `Total ${total} items`
    });

    const [filters, setFilters] = useState({
        search: "",
        study_id: searchParams.get("study_id") || "",
    });

    // helper to set individual filters in other componets
    const updateFilter = (filterName: keyof typeof filters, values: string) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: values,
        }));
    };

    // Fetch data from server
    const fetchData = async (params: {
        pagination: TablePaginationConfig;
        filters: { search: string; study_id: string };
    }) => {
        setLoading(true);

        try {
            const { pagination, filters } = params;
            const response = await API.get('/samples', {
                params: {
                    page: pagination.current,
                    pageSize: pagination.pageSize,
                    search: filters.search,
                    study_id: filters.study_id
                },
            });

            const transformedData = response.data.samples.map((sample: any, idx: number) => ({
                key: `${idx}__${sample.id_study_lims}__${sample.id_sample_lims}`,
                sample: sample
            }));
            const total = transformedData.length;

            setData(transformedData);
            setPagination({
                ...pagination,
                total, // Update total number of records from server
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }

        setLoading(false);
    };

    // Initial data fetch
    useEffect(() => {
        console.log("firing fetch samples");
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
            title: 'Study abbrev',
            dataIndex: ['sample', 'study_abbreviation'],
            sorter: (a, b) => SortText(a, b, 'sample.study_abbreviation'),
        },
        {
            title: <span>Sanger name <Tooltip title="sample sequencing name assigned by sciops"> < InfoCircleOutlined /></Tooltip ></span>,
            dataIndex: ['sample', 'sanger_sample_id'],
            sorter: (a, b) => SortText(a, b, 'sample.sanger_sample_id'),
        },
        {
            title: <span>Sample name <Tooltip title="'sample_supplier' name provided in the sequencing manifest"> < InfoCircleOutlined /></Tooltip ></span>,
            dataIndex: ['sample', 'supplier_name'],
            sorter: (a, b) => SortText(a, b, 'sample.supplier_name'),
        },
        // {
        //     title: 'Donor',
        //     dataIndex: ['sample', 'donor_id'],
        // },
        {
            title: 'Organism',
            dataIndex: ['sample', 'organism'],
            sorter: (a, b) => SortText(a, b, 'sample.organism'),
        },
        {
            title: 'Ref. genome',
            dataIndex: ['sample', 'reference_genome'],
        },
        {
            title: 'Last updated',
            dataIndex: ['sample', 'last_updated'],
            sorter: (a, b) => SortText(a, b, 'sample.last_updated'),
        }
    ];

    return (
        <Row gutter={16}>
            {/* Filter Panel */}
            <Col span={4}>
                <div style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                    <Divider orientation="left">Filters</Divider>
                    <TextSearch selectedValues={filters.search} setSelectedValues={(values) => updateFilter('search', values)} />
                    <StudySelect selectedValues={filters.study_id} setSelectedValues={(values) => updateFilter('study_id', values)} />
                </div>
            </Col>

            {/* Table */}
            <Col span={20}>
                <TableExporter filename={"samples"} data={data.map((d) => d.sample)} />
                <Table
                    columns={columns}
                    rowKey={(record) => record.key}
                    dataSource={data}
                    pagination={pagination}
                    loading={loading}
                    bordered={true}
                    scroll={{ x: 400 }}
                    onChange={handleTableChange}
                    expandable={{
                        expandedRowRender: row => (<SampleDetails sample_id={row.sample.id_sample_tmp} />)
                    }}
                />
            </Col>
        </Row>
    );
};

export default Samples;
