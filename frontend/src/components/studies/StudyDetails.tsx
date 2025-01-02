import React from 'react';
import { Button, Card, Descriptions, Tooltip, Typography } from 'antd';
const { Text, Link } = Typography;
import { ExportOutlined } from '@ant-design/icons';

interface Props {
    study: any;
}

const StudyDetails: React.FC<Props> = ({ study }) => {

    return (
        <Card title="Study Information" bordered={true} style={{ maxWidth: 800, margin: 'auto' }}>
            <Descriptions
                column={1}
                bordered={true}
                size="small">
                <Descriptions.Item label="Study ID">
                    <Text code>{study.id_study_lims}</Text>
                    <Tooltip title="Open in Sequencescape">
                        <Link target="_blank" href={`https://sequencescape.psd.sanger.ac.uk/studies/${study.id_study_lims}/information`}>
                            <Button size="small" icon={<ExportOutlined />} iconPosition="end"> SQSC</Button>
                        </Link>
                    </Tooltip>
                </Descriptions.Item>
                <Descriptions.Item label="Abbreviation">
                    <Typography.Text>{study.abbreviation}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Study Name">
                    <Typography.Text>{study.name}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Title">
                    <Typography.Text>{study.study_title}</Typography.Text>
                </Descriptions.Item>
                {study.reference_genome && (<Descriptions.Item label="Ref. Genome">
                    {study.reference_genome}
                </Descriptions.Item>
                )}
                < Descriptions.Item label="Faculty Sponsor">{study.faculty_sponsor}</Descriptions.Item>
                <Descriptions.Item label="State">{study.state}</Descriptions.Item>
                <Descriptions.Item label="Study Type">{study.study_type}</Descriptions.Item>
                {study.ethically_approved && (
                    <Descriptions.Item label="Ethically Approved">{study.ethically_approved}</Descriptions.Item>
                )}
                {study.hmdmc_number && (
                    <Descriptions.Item label="HMDMC">{study.hmdmc_number}</Descriptions.Item>
                )}
                <Descriptions.Item label="Created At">{study.created}</Descriptions.Item>
                <Descriptions.Item label="Last Updated">{study.last_updated}</Descriptions.Item>
                <Descriptions.Item label="Recorded At">{study.recorded_at}</Descriptions.Item>
                {study.deleted_at && (
                    <Descriptions.Item label="Deleted At">{study.deleted_at}</Descriptions.Item>
                )}
                {study.description && (
                    <Descriptions.Item label="Description">
                        <Typography.Paragraph ellipsis={{ rows: 4, expandable: true }}>{study.description}</Typography.Paragraph>
                    </Descriptions.Item>)}
                <Descriptions.Item label="Abstract">
                    <Typography.Paragraph ellipsis={{ rows: 4, expandable: true }}>{study.abstract}</Typography.Paragraph>
                </Descriptions.Item>
                {study.accession_number && (
                    <Descriptions.Item label="Accession Number">{study.accession_number}</Descriptions.Item>
                )}
                {study.ega_dac_accession_number && (
                    <Descriptions.Item label="EGA DAC">{study.ega_dac_accession_number}</Descriptions.Item>
                )}
                <Descriptions.Item label="Data Release">{study.data_release_timing}</Descriptions.Item>
                {(study.data_release_delay_period || study.data_release_delay_reason) && (
                    <Descriptions.Item label="Data Delay">{study.data_release_delay_period} {study.data_release_delay_reason}</Descriptions.Item>
                )}
                <Descriptions.Item label="Contains Human DNA">{study.contains_human_dna == 1 ? "Yes" : "No"}</Descriptions.Item>
                {study.data_access_group && (
                    <Descriptions.Item label="Data Access Group">{study.data_access_group}</Descriptions.Item>
                )}
                <Descriptions.Item label="Programme">{study.programme}</Descriptions.Item>
                {study.study_visibility && (
                    <Descriptions.Item label="Visibility">{study.study_visibility}</Descriptions.Item>
                )}
            </Descriptions>
        </Card >
    );
};

export default StudyDetails;