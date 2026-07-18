"use client";

import { useState } from "react";
import { Button, Card, Chip, Select, Table } from "@heroui/react";
import { Trash2 } from "lucide-react";
import type { PlatformUser, UserRole } from "@/types/admin";

const ROLE_OPTIONS: { key: UserRole; label: string }[] = [
  { key: "admin", label: "Admin" },
  { key: "librarian", label: "Librarian" },
  { key: "reader", label: "Reader" },
];

const ROLE_CHIP_COLOR: Record<UserRole, "primary" | "secondary" | "default"> = {
  admin: "primary",
  librarian: "secondary",
  reader: "default",
};

export function ManageUsersTable({ initialUsers }: { initialUsers: PlatformUser[] }) {
  const [users, setUsers] = useState(initialUsers);

  async function handleRoleChange(user: PlatformUser, nextRole: UserRole) {
    if (nextRole === user.role) return;
    // TODO: replace with a real request, e.g.
    // await fetch(`/api/admin/users/${user.id}/role`, { method: "PATCH", body: JSON.stringify({ role: nextRole }) });
    setUsers((current) =>
      current.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
    );
  }

  async function handleDelete(user: PlatformUser) {
    const confirmed = window.confirm(
      `Remove ${user.name} (${user.email}) from the platform?`
    );
    if (!confirmed) return;

    // TODO: replace with a real request, e.g.
    // await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    setUsers((current) => current.filter((u) => u.id !== user.id));
  }

  return (
    <Card variant="default" className="border border-ink-100">
      <Card.Header className="p-5 pb-0">
        <Card.Title className="font-serif text-lg text-ink-900">
          Manage users
        </Card.Title>
        <Card.Description>
          {users.length.toLocaleString()} accounts across all roles
        </Card.Description>
      </Card.Header>
      <Card.Content className="p-5">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Platform users">
              <Table.Header>
                <Table.Column>Name</Table.Column>
                <Table.Column>Email</Table.Column>
                <Table.Column>Role</Table.Column>
                <Table.Column>Change role</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body items={users}>
                {(user: PlatformUser) => (
                  <Table.Row key={user.id} id={user.id}>
                    <Table.Cell className="font-medium text-ink-900">
                      {user.name}
                    </Table.Cell>
                    <Table.Cell className="text-ink-500">{user.email}</Table.Cell>
                    <Table.Cell>
                      <Chip color={ROLE_CHIP_COLOR[user.role]} variant="soft" size="sm">
                        {user.role}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      <Select
                        aria-label={`Change role for ${user.name}`}
                        selectedKey={user.role}
                        onSelectionChange={(key) =>
                          handleRoleChange(user, key as UserRole)
                        }
                        className="w-40"
                      >
                        {ROLE_OPTIONS.map((option) => (
                          <Select.Item key={option.key} id={option.key}>
                            {option.label}
                          </Select.Item>
                        ))}
                      </Select>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onPress={() => handleDelete(user)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
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
