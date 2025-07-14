# Endpoints
* **Base URL: https://aoiapi.vercel.app**

---

```sh
/find
```

**Query Params**
* `name`: The name of the function
* `limit`: The limit of the function to be searched for

**Example**
```sh
https://aoiapi.vercel.app/find?name=ban&limit=10
```

---

```sh
/list
```

**Query Params**
* `limit`: Limit of the function to be listed

**Example**
```sh
https://aoiapi.vercel.app/list?limit=20
```

---

```sh
/function
```

**Query Params**
* `name`: The name of the function

**Example**
```sh
https://aoiapi.vercel.app/function?name=ban
```
