import { useEffect, useState } from "react";
import useTodoStore from "./store/useTodoStore";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Todos = () => {
  const {
    loading,
    todos,
    error,
    fetchTodos,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleCompleted,
  } = useTodoStore();
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);
  const [filter, setFilter] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setTitle("");
    setEditTodoId(null);
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateTodo({ id: editTodoId, title });
    } else {
      addTodo({
        title,
        completed: false,
      });
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteTodo(id);
    }
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setEditTodoId(todo.id);
    setIsEditing(true);
    handleOpen();
  };

  const handleToggleCompleted = (id) => {
    toggleCompleted(id);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const searchTodo = todos
    .filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()))
    .filter((todo) => {
      if (filter === "") return true;
      return filter === "completed" ? todo.completed : !todo.completed;
    });

  return (
    <div style={{ display: "flex" }}>
      <div style={{ paddingTop: "100px", paddingLeft: "50px" }}>
        <div>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <div className="search">
              <TextField
                variant="outlined"
                label="Search..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleOpen} variant="contained">
                Add
              </Button>
              <Select
                value={filter}
                onChange={handleFilterChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}>
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="not-completed">❌ Not Completed</MenuItem>
                <MenuItem value="completed">✅ Completed</MenuItem>
              </Select>
            </div>
          </FormControl>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
              <form onSubmit={handleSubmit} className="form_cl">
                <TextField
                  required
                  variant="outlined"
                  label="Name"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Button type="submit" variant="contained" className="addTodo">
                  {isEditing ? "Update" : "Add"}
                </Button>
              </form>
            </Box>
          </Modal>
        </div>
        {loading && <div className="loader"></div>}
        {error && <h2>{error}</h2>}
        {searchTodo.length > 0 && (
          <ol>
            {searchTodo.map((todo) => (
              <li key={todo.id} className="tr">
                <p className={todo.completed ? "" : "toggleComp"}>
                  {todo.title}
                </p>
                <button
                  className="completed_button"
                  style={{
                    border: "none",
                    backgroundColor: "inherit",
                    marginLeft: "20px",
                  }}
                  onClick={() => handleToggleCompleted(todo.id)}>
                  {todo.completed ? "✅" : "❌"}
                </button>
                <button
                  className="Delete"
                  onClick={() => handleDelete(todo.id)}>
                  Delete
                </button>
                <button className="Update" onClick={() => handleEdit(todo)}>
                  Edit
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default Todos;
