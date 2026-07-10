from utils.db_connection import get_connection

class _DbCursorContext:
    def __init__(self, dictionary: bool = False, commit: bool = False):
        self.dictionary = dictionary
        self.should_commit = commit
        self.connection = None
        self.cursor = None

    def __enter__(self):
        self.connection = get_connection()
        self.cursor = self.connection.cursor(dictionary=self.dictionary)
        return self.cursor

    def __exit__(self, exc_type, exc_value, traceback):
        try:
            if self.should_commit and exc_type is None:
                self.connection.commit()
            elif self.should_commit:
                self.connection.rollback()
        finally:
            if self.cursor:
                self.cursor.close()
            if self.connection:
                self.connection.close()


def db_cursor(dictionary: bool = False, commit: bool = False):
    return _DbCursorContext(dictionary=dictionary, commit=commit)
