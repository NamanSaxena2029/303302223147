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

# Stage 3

## Why Query is Slow

Because database has too much data.

```sql id="af4n9e"
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

This query checks many rows, so it becomes slow.

---

## Solution

Use index on:

* studentID
* isRead

This makes searching faster.

---

## Better Query

```sql id="2jv6s0"
SELECT * FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

---

## Should We Add Index on Every Column?

No.

Because too many indexes:

* increase storage
* slow down insert/update

Indexes should only be used on important columns.

---

## Placement Notification Query

```sql id="q8tbz1"
SELECT * FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```
