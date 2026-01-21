CREATE TABLE posts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  date TEXT,
  image TEXT,
  source TEXT,
  user_id UUID REFERENCES auth.users(id), -- Link to auth.users table
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO posts (title, description, category, date, image, source) VALUES
('Premier League: City Extends Winning Streak', 'Manchester City continues their dominant form with a 3-1 victory over Arsenal, extending their winning streak to 10 consecutive matches.', 'Premier League', '2h ago', 'https://placehold.co/600x400/000000/FFFFFF/png', 'Sky Sports'),
('Real Madrid Signs Brazilian Rising Star', 'Real Madrid announces the signing of 19-year-old Brazilian midfielder in a deal worth €50 million.', 'La Liga', '5h ago', 'https://placehold.co/600x400/FFFFFF/000000/png', 'Marca'),
('Liverpool Advances to Quarter-Finals', 'Liverpool secures their spot in the Champions League quarter-finals with a commanding 4-0 aggregate victory.', 'UCL', '1d ago', 'https://placehold.co/600x400/FF0000/FFFFFF/png', 'UEFA'),
('Juve & Inter Battle to 2-2 Draw', 'The Derby d''Italia ends in a thrilling 2-2 draw as both teams share points in a crucial title race encounter.', 'Serie A', '1d ago', 'https://placehold.co/600x400/0000FF/FFFFFF/png', 'Gazzetta'),
('South Africa Defeats Nigeria 2-1', 'Bafana Bafana secures a crucial victory against Nigeria in the World Cup qualifiers.', 'Intl', '2d ago', 'https://placehold.co/600x400/00FF00/FFFFFF/png', 'SAFA'),
('PSG Targets PL Striker', 'PSG reportedly preparing a €80 million bid for Premier League''s top scorer.', 'Transfer', '3d ago', 'https://placehold.co/600x400/FFFF00/000000/png', 'L''Équipe');
