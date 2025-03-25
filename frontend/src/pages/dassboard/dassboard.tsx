import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  background: #f0f2f5;
  min-height: 100vh;
`;

const Card = styled.div`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border-radius: 15px;
  padding: 20px;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: scale(1.05);
  }
`;

interface CardData {
  id: string;
  title: string;
  description: string;
}

const cards: CardData[] = [
  { id: '1', title: 'North India', description: 'Explore the northern region' },
  { id: '2', title: 'South India', description: 'Discover southern culture' },
  { id: '3', title: 'East India', description: 'Journey to the east' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      {cards.map((card) => (
        <Card key={card.id} onClick={() => navigate(`/map/${card.id}`)}>
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </Card>
      ))}
    </Container>
  );
};

export default Dashboard;
