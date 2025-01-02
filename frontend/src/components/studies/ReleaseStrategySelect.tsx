import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import API from '../../API';

interface OptionType {
    value: string;
    label: string;
}

interface Props {
    setSelectedValues: (values: string[]) => void;
}

const ReleaseStrategySelect: React.FC<Props> = ({ setSelectedValues }) => {
    const [options, setOptions] = useState<OptionType[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOptions = async () => {
        setLoading(true);
        try {
            const response = await API.get('/studies/release_strategy');
            const fetchedOptions = response.data.map((item: any) => ({
                value: item,
                label: <span>{item}</span>,
            }));
            setOptions(fetchedOptions);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    // Handle selection change
    const handleChange = (values: string[]) => {
        setSelectedValues(values);
        console.log('Selected values:', values);
    };

    return (
        <div style={{ marginBottom: '16px' }}>
            <label><LogoutOutlined /> Release Strategy:</label>
            <Select
                mode="multiple"
                placeholder="Release strategy"
                style={{ width: '100%', marginTop: '4px' }}
                loading={loading}
                onChange={handleChange}
                allowClear
                notFoundContent={loading ? <Spin size="small" /> : null}
                options={options}
            >
            </Select>
        </div>
    );
};

export default ReleaseStrategySelect;