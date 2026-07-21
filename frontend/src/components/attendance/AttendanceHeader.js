import React from 'react';
import styled from 'styled-components';
import {
  Users,
  UserCheck,
  UserX,
  Clock3,
  Timer,
  LogOut,
  Percent,
  Hourglass,
} from 'lucide-react';

// ─── Styled Components ──────────────────────────────────────────────────

const Container = styled.div`
  margin-bottom: 40px;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeadingGroup = styled.div``;

const Heading = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #0b1a33;
  letter-spacing: -0.5px;
`;

const SubHeading = styled.p`
  margin: 6px 0 0;
  color: #5b6f87;
  font-size: 15px;
  font-weight: 400;
`;

const DateBadge = styled.div`
  padding: 10px 24px;
  border-radius: 2px;
  background: #b9c7ec;
  color: #1a3b6b;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 20, 50, 0.06);
  border: 1px solid rgba(26, 59, 107, 0.08);
  white-space: nowrap;
`;

// ─── Cards Wrapper (Wrapping & Centering) ─────────────────────────────

const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap; /* allows cards to wrap to next line */
  justify-content: center; /* centers the entire row of cards */
  gap: 5px;
  padding: 4px 0; /* slight vertical padding for breathing room */

  @media (max-width: 768px) {
    gap: 14px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const Card = styled.div`
  flex: 0 0 auto; /* prevents growing/shrinking – respects width */
  width: 100px; /* fixed width – adjust as needed */
  background: #ffffff;
  border-radius: 2px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #eaedf2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s ease;
  cursor: default;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
  }

  @media (max-width: 480px) {
    width: 45px; /* smaller width on tiny screens */
    padding: 8px 10px;
  }
`;

const IconBox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.bg || '#eef2f6'};
  color: ${(props) => props.color || '#2c3e50'};

  @media (max-width: 480px) {
    width: 12px;
    height: 12px;

    svg {
      width: 10px;
      height: 10px;
    }
  }
`;

const Value = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #0b1a33;
  letter-spacing: -0.3px;
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

const Label = styled.p`
  margin: 4px 0 0;
  font-size: 10px;
  font-weight: 500;
  color: #6f7d95;
  letter-spacing: 0.2px;

  @media (max-width: 480px) {
    font-size: 7px;
  }
`;

// ─── Main Component ─────────────────────────────────────────────────────

const AttendanceHeader = ({ metrics }) => {
  const cards = [
    {
      title: 'Total Employees',
      value: metrics.totalEmployees ?? 0,
      icon: Users,
      color: '#2563eb',
      bg: '#dbeafe',
    },
    {
      title: 'Present Today',
      value: metrics.present ?? 0,
      icon: UserCheck,
      color: '#16a34a',
      bg: '#dcfce7',
    },
    {
      title: 'Absent',
      value: metrics.absent ?? 0,
      icon: UserX,
      color: '#dc2626',
      bg: '#fee2e2',
    },
    {
      title: 'Late Arrivals',
      value: metrics.late ?? 0,
      icon: Clock3,
      color: '#ea580c',
      bg: '#ffedd5',
    },
    {
      title: 'Currently Working',
      value: metrics.workingNow ?? 0,
      icon: Timer,
      color: '#0891b2',
      bg: '#cffafe',
    },
    {
      title: 'Checked Out',
      value: metrics.checkedOut ?? 0,
      icon: LogOut,
      color: '#7c3aed',
      bg: '#ede9fe',
    },
    {
      title: 'Attendance Rate',
      value: `${metrics.attendanceRate ?? 0}%`,
      icon: Percent,
      color: '#059669',
      bg: '#d1fae5',
    },
    {
      title: 'Avg Working Hours',
      value: `${metrics.averageWorkingHours ?? 0} hrs`,
      icon: Hourglass,
      color: '#ca8a04',
      bg: '#fef9c3',
    },
  ];

  return (
    <Container>
      <TopSection>
        <HeadingGroup>
          <Heading>Attendance Dashboard</Heading>
          <SubHeading>Employee attendance overview for today</SubHeading>
        </HeadingGroup>

        <DateBadge>
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </DateBadge>
      </TopSection>

      <CardsWrapper>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <IconBox bg={card.bg} color={card.color}>
                <Icon size={24} />
              </IconBox>
              <div>
                <Value>{card.value}</Value>
                <Label>{card.title}</Label>
              </div>
            </Card>
          );
        })}
      </CardsWrapper>
    </Container>
  );
};

export default AttendanceHeader;
