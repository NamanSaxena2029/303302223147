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

# Stage 4

## Solution

Do not fetch notifications on every page load.

Use:

* Pagination
* Cache memory

This reduces DB load and improves speed.

---

## Performance Improvement

* Load only latest notifications
* Store frequently used data in cache

---

## Tradeoff

Cache is faster but may show old data for some time.

---

# Stage 5

## Problems

* Sending emails one by one is slow
* If email fails, notification may not reach user

---

## Better Solution

Use Queue System.

* Save notification in DB first
* Send emails in background

This makes system faster and reliable.

---

## Revised Pseudocode

```txt id="0lx7l0"
function notify_all(student_ids, message):

   save_to_db(student_ids, message)

   add_to_queue(student_ids, message)

worker_process():
   send_email()
   push_to_app()
```


# Stage 6

Priority notifications are shown using priority order:

* Placement
* Result
* Event

Notifications are sorted based on importance.


# Stage 7

## Frontend - Notification App

React app running on `http://localhost:3000`

### Pages

**1. All Notifications**
- Fetches all notifications from API
- New notifications highlighted in color
- Already viewed shown in grey
- Search filter available

**2. Priority Notifications**
- Filter by type: Placement, Result, Event
- Top N limit — show only limited notifications
- Apply button to fetch filtered results

### API Used
- `GET /evaluation-service/notifications`
- `GET /evaluation-service/notifications?limit=5&notification_type=Placement`

### Tech Stack
- React + Vite
- Material UI
- Runs on localhost:3000