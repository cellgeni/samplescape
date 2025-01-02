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
        setSelectedValues(value);
        console.log('Search value:', value);
    };

    return (
        <div style={{ marginBottom: '16px' }}>
            <label><FileSearchOutlined /> Abbr. / Name / Title:</label>
            <Input
                placeholder="Search by name, title, abbrevation..."
                onChange={handleChange}
                value={selectedValues}
                style={{ marginTop: '4px' }}
            />
        </div>
    );
};

export default TextSearch;