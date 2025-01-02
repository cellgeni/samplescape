import React from 'react';
import { Input } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';


interface Props {
    selectedValues: string;
    setSelectedValues: (values: string) => void;
}

const TextSearch: React.FC<Props> = ({ selectedValues, setSelectedValues }) => {

    // Handle selection change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (value) {
            value = value.trim();
        }
        setSelectedValues(value);
        console.log('Search value:', value);
    };

    return (
        <div style={{ marginBottom: '16px' }}>
            <label><FileSearchOutlined /> Sanger / Supplier name:</label>
            <Input
                placeholder="Search by name"
                onChange={handleChange}
                value={selectedValues}
                style={{ marginTop: '4px' }}
            />
        </div>
    );
};

export default TextSearch;