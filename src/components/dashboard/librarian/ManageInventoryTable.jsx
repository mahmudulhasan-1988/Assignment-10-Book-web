"use client";

import { useState } from "react";
import { Button, Card, Chip, Input, Table } from "@heroui/react";
import { BOOK_STATUS, CATEGORIES, statusChipColor } from "@/lib/librarian-data";

export default function ManageInventoryTable({ books, onUpdateBook, onDeleteBook }) {
  const [editingBook, setEditingBook] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  function startEdit(book) {
    setEditingBook({ ...book });
    setConfirmDeleteId(null);
  }

  function saveEdit() {
    onUpdateBook(editingBook);
    setEditingBook(null);
  }

  function togglePublish(book) {
    if (book.status !== BOOK_STATUS.PUBLISHED) return;
    onUpdateBook({ ...book, status: BOOK_STATUS.UNPUBLISHED });
  }

  return (
    <div className="flex flex-col gap-4">
      {editingBook && (
        <Card className="p-5">
          <Card.Header>
            <Card.Title className="font-mono-label text-[11px] uppercase text-[var(--rr-gold)]">
              Editing “{editingBook.title}”
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--rr-ink-dim)]">Title</label>
                <Input
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--rr-ink-dim)]">Author</label>
                <Input
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--rr-ink-dim)]">Delivery Fee (USD)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingBook.deliveryFee}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, deliveryFee: parseFloat(e.target.value) || 0 })
                  }
                  className="rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--rr-ink-dim)]">Category</label>
                <select
                  value={editingBook.category}
                  onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                  className="rr-select rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--rr-gold)]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs text-[var(--rr-ink-dim)]">Description</label>
                <textarea
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  rows={3}
                  className="rr-select resize-none rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--rr-gold)]"
                />
              </div>
            </div>
            {editingBook.status !== BOOK_STATUS.PENDING && (
              <p className="mt-3 text-[11px] text-[var(--rr-ink-dim)]">
                Editing details doesn&apos;t change the approval status.
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <Button variant="primary" onPress={saveEdit}>
                Save Changes
              </Button>
              <Button variant="ghost" onPress={() => setEditingBook(null)}>
                Cancel
              </Button>
            </div>
          </Card.Content>
        </Card>
      )}

      <Card className="p-2">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Manage inventory">
              <Table.Header>
                <Table.Column isRowHeader>Title</Table.Column>
                <Table.Column>Category</Table.Column>
                <Table.Column>Fee</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body items={books} renderEmptyState={() => (
                <div className="px-4 py-10 text-center text-sm text-[var(--rr-ink-dim)]">
                  You haven&apos;t listed any books yet. Use the form above to add one.
                </div>
              )}>
                {(book) => {
                  const isConfirming = confirmDeleteId === book.id;
                  return (
                    <Table.Row id={book.id}>
                      <Table.Cell>
                        <span className="font-display text-[15px]">{book.title}</span>
                        <div className="text-[11px] text-[var(--rr-ink-dim)]">{book.author}</div>
                      </Table.Cell>
                      <Table.Cell>{book.category}</Table.Cell>
                      <Table.Cell>
                        <span className="font-mono-label text-[var(--rr-gold-bright)]">
                          ${book.deliveryFee.toFixed(2)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Chip color={statusChipColor[book.status]} variant="soft" size="sm">
                          {book.status}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        {isConfirming ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] text-[var(--rr-ink-dim)]">Delete?</span>
                            <Button size="sm" variant="danger" onPress={() => onDeleteBook(book.id)}>
                              Confirm
                            </Button>
                            <Button size="sm" variant="ghost" onPress={() => setConfirmDeleteId(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            <Button size="sm" variant="outline" onPress={() => startEdit(book)}>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onPress={() => setConfirmDeleteId(book.id)}
                            >
                              Delete
                            </Button>
                            {book.status === BOOK_STATUS.PUBLISHED && (
                              <Button size="sm" variant="outline" onPress={() => togglePublish(book)}>
                                Unpublish
                              </Button>
                            )}
                            {book.status === BOOK_STATUS.PENDING && (
                              <span
                                title="A librarian cannot publish a book that's still Pending Approval — an admin has to approve it first."
                                className="font-mono-label cursor-not-allowed text-[10px] uppercase text-[var(--rr-ink-dim)]"
                              >
                                Awaiting approval
                              </span>
                            )}
                            {book.status === BOOK_STATUS.UNPUBLISHED && (
                              <span
                                title="Only an admin can republish an unpublished book."
                                className="font-mono-label cursor-not-allowed text-[10px] uppercase text-[var(--rr-ink-dim)]"
                              >
                                Unpublished
                              </span>
                            )}
                          </div>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                }}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Card>
    </div>
  );
}
