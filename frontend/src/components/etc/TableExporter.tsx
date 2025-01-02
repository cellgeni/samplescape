import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useCSVDownloader } from 'react-papaparse';

interface Props {
    filename: string;
    data: any[];
}

const TableExporter: React.FC<Props> = ({ filename, data }) => {
    const { CSVDownloader } = useCSVDownloader();

    return (
        <Button>
            <CSVDownloader
                type={Button}
                filename={filename}
                bom={true}
                download={true}
                config={{ delimiter: ',' }}
                data={data}>
                <DownloadOutlined /> Export CSV
            </CSVDownloader>
        </Button>
    );
};

export default TableExporter;