import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  deleteTodo,
  addTodo,
  updateTodo,
  toggleCompleted,
} from "./app/Todo/TodoSlice";
import { Box, Button, Modal, TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Todos = () => {
  const { loading, Todos, error } = useSelector((state) => state.Todo);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setTitle("");
    setEditTodoId(null);
  };

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateTodo({ id: editTodoId, title }));
    } else {
      dispatch(
        addTodo({
          title,
          completed: false,
        })
      );
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(deleteTodo(id));
    }
  };

  const handleEdit = (Todo) => {
    setTitle(Todo.title);
    setEditTodoId(Todo.id);
    setIsEditing(true);
    handleOpen();
  };

  const handleToggleCompleted = (id) => {
    dispatch(toggleCompleted(id));
  };

  const filteredTodos = Todos.filter((Todo) =>
    Todo.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          paddingTop: "100px",
          paddingLeft: "50px",
        }}>
        <div>
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
                <Button type="submit" className="Add">
                  {isEditing ? "Update" : "Add"}
                </Button>
              </form>
            </Box>
          </Modal>
        </div>
        {loading && <h2>Loading...</h2>}
        {error && <h2>{error}</h2>}
        {filteredTodos.length > 0 && (
          <ol>
            {filteredTodos.map((Todo) => (
              <li key={Todo.id} className="tr">
                <p className={Todo.completed ? "" : "toggleComp"}>
                  {Todo.title}
                </p>
                <button
                  className="completed_button"
                  style={{
                    border: "none",
                    backgroundColor: "inherit",
                    marginLeft: "20px",
                  }}
                  onClick={() => handleToggleCompleted(Todo.id)}>
                  {Todo.completed ? "✅" : "❌"}
                </button>
                <button
                  className="Delete"
                  onClick={() => handleDelete(Todo.id)}>
                  Delete
                </button>
                <button className="Update" onClick={() => handleEdit(Todo)}>
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
