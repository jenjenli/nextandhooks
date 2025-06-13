'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';


export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
    <Home>
      <Header>Welcome to Job Finder</Header>
      <p>Search for Locations below</p>
      <div>
      <input
        type="text"
        placeholder="Location..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}/>
        <Link href={`/jobs?search=${encodeURIComponent(searchTerm)}`}>Search</Link>
        </div>

    </Home>
    </>
  );
}

const Home = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const Header = styled.h1`
  font-size: 2.5rem;
  color: green;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
`