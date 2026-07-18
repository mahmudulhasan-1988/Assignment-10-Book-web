"use client";

import { Card, Table } from "@heroui/react";
import type { Transaction } from "@/types/admin";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card variant="default" className="border border-ink-100">
      <Card.Header className="p-5 pb-0">
        <Card.Title className="font-serif text-lg text-ink-900">
          All transactions
        </Card.Title>
        <Card.Description>
          Every completed sale between readers and librarians
        </Card.Description>
      </Card.Header>
      <Card.Content className="p-5">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Transactions">
              <Table.Header>
                <Table.Column>Transaction ID</Table.Column>
                <Table.Column>User email</Table.Column>
                <Table.Column>Librarian email</Table.Column>
                <Table.Column>Book</Table.Column>
                <Table.Column>Amount</Table.Column>
                <Table.Column>Date</Table.Column>
              </Table.Header>
              <Table.Body items={transactions}>
                {(txn: Transaction) => (
                  <Table.Row key={txn.id} id={txn.id}>
                    <Table.Cell className="font-mono text-xs text-ink-500">
                      {txn.id}
                    </Table.Cell>
                    <Table.Cell>{txn.userEmail}</Table.Cell>
                    <Table.Cell className="text-ink-500">
                      {txn.librarianEmail}
                    </Table.Cell>
                    <Table.Cell>{txn.bookTitle}</Table.Cell>
                    <Table.Cell className="tabular-nums font-medium text-ink-900">
                      ${txn.amount.toFixed(2)}
                    </Table.Cell>
                    <Table.Cell className="text-ink-500">
                      {formatDate(txn.date)}
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
