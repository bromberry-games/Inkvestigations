CREATE TABLE mysteries (
    Name TEXT PRIMARY KEY UNIQUE,
    Description TEXT,
    Prompt TEXT
);

CREATE TABLE unlocked_mysteries (
    user_id UUID NOT NULL,
    Name TEXT NOT NULL,
    unlocked BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, Name),
    FOREIGN KEY (user_id) REFERENCES auth.users(id),
    FOREIGN KEY (Name) REFERENCES mysteries(Name)
);

alter table mysteries 
  enable row level security;

alter table unlocked_mysteries 
  enable row level security;

create policy "Mysteries are viewable by everyone"
  on mysteries for select using (
    true
  );