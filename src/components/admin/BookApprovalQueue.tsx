"use client";

import { useState } from "react";
import { Button, Card, Chip, Table } from "@heroui/react";
import { Check, Trash2 } from "lucide-react";
import type { Book } from "@/types/admin";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function BookApprovalQueue({ initialBooks }: { initialBooks: Book[] }) {
  const [books, setBooks] = useState(initialBooks);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  async function handleApprove(book: Book) {
    setPendingActionId(book.id);
    try {
      // TODO: replace with a real request, e.g.
      // await fetch(`/api/admin/books/${book.id}/approve`, { method: "POST" });
      setBooks((current) => current.filter((b) => b.id !== book.id));
    } finally {
      setPendingActionId(null);
    }
  }

  async function handleDelete(book: Book) {
    const confirmed = window.confirm(
      `Delete "${book.title}" by ${book.author}? This can't be undone.`
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
      <Card.Header className="flex flex-row items-center justify-between p-5 pb-0">
        <div>
          <Card.Title className="font-serif text-lg text-ink-900">
            Book approval queue
          </Card.Title>
          <Card.Description>
            New submissions from librarians waiting on review
          </Card.Description>
        </div>
        <Chip color="warning" variant="soft">
          {books.length} pending
        </Chip>
      </Card.Header>
      <Card.Content className="p-5">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Books pending approval">
              <Table.Header>
                <Table.Column>Title</Table.Column>
                <Table.Column>Author</Table.Column>
                <Table.Column>Category</Table.Column>
                <Table.Column>Submitted by</Table.Column>
                <Table.Column>Submitted</Table.Column>
                <Table.Column>Price</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body
                items={books}
                renderEmptyState={() => (
                  <div className="py-10 text-center text-sm text-ink-400">
                    Nothing waiting on review right now.
                  </div>
                )}
              >
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
                    <Table.Cell className="text-ink-500">
                      {formatDate(book.submittedAt)}
                    </Table.Cell>
                    <Table.Cell className="tabular-nums">
                      ${book.price.toFixed(2)}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          isDisabled={pendingActionId === book.id}
                          onPress={() => handleApprove(book)}
                        >
                          <Check size={14} />
                          Approve &amp; publish
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
