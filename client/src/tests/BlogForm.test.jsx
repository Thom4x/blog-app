import { render, screen } from "@testing-library/react";
import BlogForm from "../components/BlogForm";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useField } from "../hooks/useField";
import { useBlogActions, useNotificationActions } from "../hooks/useStore";
import React from "react";

vi.mock("../hooks/useField", () => ({
  useField: vi.fn(),
}));

vi.mock("../hooks/useStore", () => ({
  useBlogActions: vi.fn(),
  useNotificationActions: vi.fn(),
}));

describe("<BlogForm />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useField).mockImplementation((type) => {
      const [value, setValue] = React.useState("");
      return {
        type,
        value,
        onChange: (event) => setValue(event.target.value),
        onReset: () => setValue(""),
      };
    });
    vi.mocked(useNotificationActions).mockReturnValue({
      setNotification: vi.fn(),
      clearNotification: vi.fn(),
    });
  });

  test("El formulario llama al controlador de eventos cuando se envía", async () => {
    const mockCreateBlog = vi.fn();
    vi.mocked(useBlogActions).mockReturnValue({
      createBlog: mockCreateBlog,
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter >
        <BlogForm />
      </MemoryRouter>,
    );

    const titleInput = screen.getByLabelText("title:");
    const authorInput = screen.getByLabelText("author:");
    const urlInput = screen.getByLabelText("url:");
    const submitButton = screen.getByRole("button", { name: "Create" });

    await user.type(titleInput, "Test Blog");
    await user.type(authorInput, "Test Author");
    await user.type(urlInput, "https://www.test.com");
    await user.click(submitButton);

    expect(mockCreateBlog).toHaveBeenCalledTimes(1);
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: "Test Blog",
      author: "Test Author",
      url: "https://www.test.com",
    });
  });
});
