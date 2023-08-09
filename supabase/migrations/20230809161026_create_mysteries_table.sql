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
