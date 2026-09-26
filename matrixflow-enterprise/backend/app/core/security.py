from datetime import UTC, datetime, timedelta


def create_access_token(subject: str) -> str:
    expires_at = datetime.now(UTC) + timedelta(hours=8)
    return f"demo-token:{subject}:{int(expires_at.timestamp())}"
