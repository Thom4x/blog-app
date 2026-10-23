import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Blog from "../components/Blog";

import {
  useBlogActions,
  useNotificationActions,
  useUser,
} from "../hooks/useStore";

const blog = {
  id: "1",
  title: "Test Blog Title",
  author: "Test Author",
  url: "http://testblog.com",
  likes: 5,
  comments: [],
  user: {
    username: "creator",
    name: "Creator Name",
    id: "user1",
  },
};

vi.mock("../hooks/useStore", () => ({
  useBlogActions: vi.fn(),
  useNotificationActions: vi.fn(),
  useUser: vi.fn(),
}));

// Helper porque Blog usa useMatch, necesita estar dentro de un Router
const renderBlog = () => {
  return render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Blog blog={blog}  />
    </MemoryRouter>,
  );
};

describe("<Blog />", () => {
  let user = null; 

  const likeBlog = vi.fn();
  const deleteBlog = vi.fn();
  const postComments = vi.fn();
  const setNotification = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useBlogActions).mockReturnValue({
      likeBlog,
      deleteBlog,
      postComments,
    });
    vi.mocked(useNotificationActions).mockReturnValue({
      setNotification,
    });
    vi.mocked(useUser).mockReturnValue(user);
  });

  test("muestra info del blog y likes a usuarios no autenticados, sin botones", () => {
    user = null;
    vi.mocked(useUser).mockReturnValue(user);

    renderBlog()

    expect(
      screen.getByText("Test Blog Title", { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText("5 likes", { exact: false })).toBeInTheDocument();

    expect(screen.queryByTestId("like-button")).not.toBeInTheDocument();
    expect(screen.queryByText("remove")).not.toBeInTheDocument();
  });

  test("a un usuario autenticado que NO es el creador solo se le muestra el botón like", () => {
    user = "otheruser";
    vi.mocked(useUser).mockReturnValue(user);

    renderBlog();

    expect(screen.getByTestId("like-button")).toBeInTheDocument();
    expect(screen.queryByText("remove")).not.toBeInTheDocument();
  });

  test("al creador del blog se le muestra también el botón remove", () => {
    user = "creator";
    vi.mocked(useUser).mockReturnValue(user);

    renderBlog();

    expect(screen.getByText("like")).toBeInTheDocument();
    expect(screen.getByText("remove")).toBeInTheDocument();
  });
});
