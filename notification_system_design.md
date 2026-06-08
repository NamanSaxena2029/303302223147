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
