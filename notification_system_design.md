# Stage 1

## Get Notifications

```http id="b0yq0i"
GET /notifications
```

Response:

```json id="f6a4d0"
{
  "message": "All notifications"
}
```

---

## Create Notification

```http id="5v11q6"
POST /notifications
```

Request:

```json id="s33b74"
{
  "title": "New Message"
}
```

Response:

```json id="crzgt1"
{
  "message": "Notification created"
}
```

---

## Real Time Notification

Using WebSocket for live notifications.


# Stage 2

## Database

Using SQL Database.

### Table: notifications

| Column  | Type    |
| ------- | ------- |
| id      | INT     |
| title   | VARCHAR |
| message | TEXT    |

---

## Create Table Query

```sql
CREATE TABLE notifications (
  id INT PRIMARY KEY,
  title VARCHAR(100),
  message TEXT
);
```

---

## Insert Notification

```sql
INSERT INTO notifications
VALUES (1, 'New Message', 'Hello User');
```

---

## Get Notifications

```sql
SELECT * FROM notifications;
```

---

## Problem with Large Data

* Slow queries
* More storage needed

## Solution

* Use indexing
* Delete old notifications