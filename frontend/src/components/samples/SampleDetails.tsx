import React, { useEffect, useState } from 'react';
import { Typography, Table, Tooltip } from 'antd';
const { Paragraph } = Typography;
import { ExclamationCircleOutlined } from '@ant-design/icons';
import API from '../../API';
import type { ColumnsType } from 'antd/es/table';

interface Props {
    sample_id: number;
}

const SampleDetails: React.FC<Props> = ({ sample_id }) => {
    const [samples, setSamples] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchSampleDetail = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/samples/${sample_id}`);
            setSamples(response.data);
        } catch (error) {
            console.error('Error fetching sample deatils:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSampleDetail();
    }, []);

    const columns: ColumnsType<any> = [
        {
            title: 'Sanger ID',
            dataIndex: ['sanger_sample_id']
        },
        {
            title: 'Run ID',
            dataIndex: ['id_run']
        },
        {
            title: 'Position',
            dataIndex: ['position']
        },
        {
            title: 'Tag index',
            dataIndex: ['tag_index']
        },
        {
            title: 'Run description',
            dataIndex: ['run_description']
        },
        {
            title: 'Run date',
            dataIndex: ['run_date']
        },
        {
            title: <span>iRODS <Tooltip title="Sample may be on iRODS and not show in this list. Use `imeta` if the column is empty."> < ExclamationCircleOutlined /></Tooltip ></span>,
            dataIndex: ['irods_path'],
            render: (text, _) => {
                if (text) {
                    return (
                        <Paragraph ellipsis={{ rows: 1, expandable: true }} copyable={{ text: text }}>{text}</Paragraph>
                    );
                }
            }

        }
    ];

    return (
        <Table
            size="small"
            style={{ marginBottom: '8px' }}
            columns={columns}
            loading={loading}
            pagination={false}
            dataSource={samples}
        />
    );
};

export default SampleDetails;