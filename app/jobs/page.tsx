'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; 
import styled from 'styled-components';
import Link from 'next/link';

type Job = {
  id: string;
  url: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  jobIndustry: string;
  jobType: string;
  jobGeo: string;
  jobLevel: string;
  jobExcerpt: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
};

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
      fetch('/api/jobs')
        .then((res) => res.json())
        .then((data) => {
          const filteredJobs = data.jobs.filter((job: Job) =>
            job.jobGeo.toLowerCase().includes(searchTerm)
          );
          setJobs(filteredJobs);
        });
    
  }, [searchTerm]);

  return (
    <div>
      <Heading>Jobs {searchTerm && `in "${searchTerm}"`}</Heading>

        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <Container>
                <Box>
                  <Link
                    href={{
                      pathname: '/jobs/details',
                      query: {
                        id: job.id,
                        title: job.jobTitle,
                        company: job.companyName,
                        excerpt: job.jobExcerpt,
                        location: job.jobGeo,
                        image: job.companyLogo,
                        salaryMin: job.salaryMin,
                        salaryMax: job.salaryMax,
                      },
                    }}
                  >
                    {job.companyName} - {job.jobTitle}
                  </Link>

                  <p><strong>Company:</strong> {job.companyName}</p>
                  <p><strong>Location:</strong> {job.jobGeo}</p>
                  <p><strong>Type:</strong> {job.jobType}</p>
                  <p><strong>Level:</strong> {job.jobLevel}</p>
                  <p><strong>Industry:</strong> {job.jobIndustry}</p>
                  <p>
                    <strong>Salary:</strong> {job.salaryCurrency} {job.salaryMin} - {job.salaryMax}
                  </p>

                  {job.companyLogo && (
                    <ImageContainer>
                      <img src={job.companyLogo} alt={`${job.companyName} logo`} width={100} />
                    </ImageContainer>
                  )}
                </Box>
              </Container>
            </li>
          ))}
        </ul>
      
    </div>
  );
}

const Heading = styled.h1`
  text-align: center;
`;

const Box = styled.div`
  justify-content: center;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: gray;
  text-align: center;
  margin: 1rem;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;


