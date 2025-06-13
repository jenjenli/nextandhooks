'use client';

import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';

export default function JobDetails() {
  const params = useSearchParams();

  const jobTitle = params.get('title') ?? '';
  const company = params.get('company') ?? '';
  const location = params.get('location') ?? '';
  const excerpt = params.get('excerpt') ?? '';
  const image = params.get('image') ?? '';

  return (
    <Container>
      <h1>{jobTitle}</h1>
      {image && (
        <img
          src={image}
          alt={`${company} logo`}
          style={{ width: '100px', height: '100px' }}
        />
      )}
      <p><strong>Company:</strong> {company}</p>
      <p><strong>Location:</strong> {location}</p>
      <p><strong>Summary:</strong> {excerpt}</p>
    </Container>
  );
}

const Container = styled.div`
  display: flex; 
  justify-content: center; 
  align-items: center; 
  height: 100vh;
  flex-direction: column; 
  text-align: center; 
`;

