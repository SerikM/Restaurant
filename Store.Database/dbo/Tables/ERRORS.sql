CREATE TABLE [dbo].[ERRORS] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [DateCreated] DATETIME2 (7)  NOT NULL,
    [Message]     NVARCHAR (MAX) NULL,
    [StackTrace]  NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_ERRORS] PRIMARY KEY CLUSTERED ([ID] ASC)
);

