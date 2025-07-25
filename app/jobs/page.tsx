'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; 
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

function JobsListContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';
  
  const router = useRouter();

  useEffect(() => {
    setError(null);  // Clear previous errors on new fetch
    fetch('/api/jobs')
      .then(async (res) => {
        if (res.status === 429) {
          // Handle rate limit error
          const data = await res.json();
          setError(data.error || 'Too many requests. Please try again later.');
          setJobs([]);
          return;
        }

        if (!res.ok) {
          setError('Failed to fetch jobs');
          setJobs([]);
          return;
        }

        const data = await res.json();
        const filteredJobs = data.jobs.filter((job: Job) =>
          job.jobGeo.toLowerCase().includes(searchTerm)
        );
        if (filteredJobs.length === 0) {
          alert('No jobs found for this location');
        }
        setJobs(filteredJobs);
      })
      .catch(() => {
        setError('Network error. Please try again later.');
        setJobs([]);
      });
  }, [searchTerm]);

  return (
    <div>
      {/* Back button */}
      <BackButton onClick={() => router.back()}>← Back</BackButton>

      <Heading>Jobs {searchTerm && `in "${searchTerm}"`}</Heading>

      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
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
      )}
    </div>
  );
}

export default function JobsList() {
  return (
    <Suspense fallback={<div>Loading jobs...</div>}>
      <JobsListContent />
    </Suspense>
  );
}

const Heading = styled.h1`
  text-align: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #0070f3;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: #0051a3;
  }
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

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
`;
