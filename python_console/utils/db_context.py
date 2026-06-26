from utils.db_connection import get_connection


class _DbCursor:
    def __init__(self, dictionary: bool = False, commit: bool = False):
        self.dictionary = dictionary
        self.should_commit = commit
        self.conn = None
        self.cursor = None

    def __enter__(self):
        self.conn = get_connection()
        self.cursor = self.conn.cursor(dictionary=self.dictionary)
        return self.cursor

    def __exit__(self, exc_type, exc_value, traceback):
        try:
            if self.should_commit and exc_type is None:
                self.conn.commit()
            elif self.should_commit:
                self.conn.rollback()
        finally:
            if self.cursor:
                self.cursor.close()
            if self.conn:
                self.conn.close()

        return False


def db_cursor(dictionary: bool = False, commit: bool = False):
    return _DbCursor(dictionary=dictionary, commit=commit)
