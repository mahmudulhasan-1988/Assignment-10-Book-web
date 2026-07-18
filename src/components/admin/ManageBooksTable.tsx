"use client";

import { useState } from "react";
import { Button, Card, Chip, Table } from "@heroui/react";
import { EyeOff, Trash2 } from "lucide-react";
import type { Book, BookStatus } from "@/types/admin";

const STATUS_LABEL: Record<BookStatus, string> = {
  pending_approval: "Pending approval",
  published: "Published",
  unpublished: "Unpublished",
};

const STATUS_COLOR: Record<BookStatus, "warning" | "success" | "default"> = {
  pending_approval: "warning",
  published: "success",
  unpublished: "default",
};

export function ManageBooksTable({ initialBooks }: { initialBooks: Book[] }) {
  const [books, setBooks] = useState(initialBooks);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  async function handleUnpublish(book: Book) {
    setPendingActionId(book.id);
    try {
      // TODO: replace with a real request, e.g.
      // await fetch(`/api/admin/books/${book.id}/unpublish`, { method: "POST" });
      setBooks((current) =>
        current.map((b) =>
          b.id === book.id ? { ...b, status: "unpublished" as const } : b
        )
      );
    } finally {
      setPendingActionId(null);
    }
  }

  async function handleDelete(book: Book) {
    const confirmed = window.confirm(
      `Permanently delete "${book.title}"? This removes it for every user.`
    );
    if (!confirmed) return;

    setPendingActionId(book.id);
    try {
      // TODO: replace with a real request, e.g.
      // await fetch(`/api/admin/books/${book.id}`, { method: "DELETE" });
      setBooks((current) => current.filter((b) => b.id !== book.id));
    } finally {
      setPendingActionId(null);
    }
  }

  return (
    <Card variant="default" className="border border-ink-100">
      <Card.Header className="p-5 pb-0">
        <Card.Title className="font-serif text-lg text-ink-900">
          Manage all books
        </Card.Title>
        <Card.Description>
          Full catalog, platform-wide. Admins can unpublish or delete any listing.
        </Card.Description>
      </Card.Header>
      <Card.Content className="p-5">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="All books">
              <Table.Header>
                <Table.Column>Title</Table.Column>
                <Table.Column>Author</Table.Column>
                <Table.Column>Category</Table.Column>
                <Table.Column>Listed by</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Price</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body items={books}>
                {(book: Book) => (
                  <Table.Row key={book.id} id={book.id}>
                    <Table.Cell className="font-medium text-ink-900">
                      {book.title}
                    </Table.Cell>
                    <Table.Cell>{book.author}</Table.Cell>
                    <Table.Cell>{book.category}</Table.Cell>
                    <Table.Cell className="text-ink-500">
                      {book.submittedBy}
                    </Table.Cell>
                    <Table.Cell>
                      <Chip color={STATUS_COLOR[book.status]} variant="soft" size="sm">
                        {STATUS_LABEL[book.status]}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell className="tabular-nums">
                      ${book.price.toFixed(2)}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          isDisabled={
                            book.status === "unpublished" ||
                            pendingActionId === book.id
                          }
                          onPress={() => handleUnpublish(book)}
                        >
                          <EyeOff size={14} />
                          Unpublish
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          isDisabled={pendingActionId === book.id}
                          onPress={() => handleDelete(book)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Card.Content>
    </Card>
  );
}
