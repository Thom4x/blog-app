import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

import Blog from "../components/Blog";
import {
  useBlogActions,
  useNotificationActions,
  useUser,
} from "../hooks/useStore";

vi.mock("../hooks/useStore", () => ({
  useBlogActions: vi.fn(),
  useNotificationActions: vi.fn(),
  useUser: vi.fn(),
}));

const blog = {
  id: "1",
  title: "OVOSOUND-ICEMAN",
  author: "Drake",
  url: "https://www.youtube.com/watch?v=6p6PcFFUm5I",
  likes: 1000,
  comments: [],
  user: {
    username: "drake",
    name: "Drake",
  },
};

const renderBlog = (route = "/", currentBlog = blog) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Blog blog={currentBlog} />
    </MemoryRouter>,
  );

describe("<Blog />", () => {
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
    vi.mocked(useUser).mockReturnValue("drake");
  });

  test("muestra el título y el autor en la lista de blogs", () => {
    renderBlog();

    const blogSummary = screen.getByTestId("blog");
    expect(blogSummary).toHaveTextContent("OVOSOUND-SORRY TEST 2 INTO NEW BRANCH");
    expect(blogSummary).toHaveTextContent("Drake");
  });

  test("muestra los detalles del blog en su ruta", () => {
    renderBlog(`/blogs/${blog.id}`);

    expect(screen.getByText(blog.title)).toBeInTheDocument();
    expect(screen.getByText(blog.url)).toBeInTheDocument();
    expect(screen.getByText("1000 likes")).toBeInTheDocument();
  });

  test("ejecuta la acción de dar like dos veces", async () => {
    const user = userEvent.setup();
    renderBlog(`/blogs/${blog.id}`);

    const likeButton = screen.getByRole("button", { name: "like" });
    await user.click(likeButton);
    await user.click(likeButton);

    expect(likeBlog).toHaveBeenCalledTimes(2);
    expect(likeBlog).toHaveBeenCalledWith(blog.id);
  });
});
