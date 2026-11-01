# MEX-NEX — Model Data Logis

**Status:** logical model untuk implementasi bertahap, bukan migration SQL. Petakan ke storage/entity existing sebelum membuat tabel atau collection baru.

## 1. Konvensi
- ID UUID/ULID stabil; bukan array index.
- Timestamp ISO-8601 UTC.
- Semua record perusahaan membawa companyId untuk batas data.
- Status enum divalidasi server-side.
- Soft-delete hanya bila diperlukan; delete tetap diaudit.
- Data sensitif memiliki klasifikasi dan retention.

## 2. Entitas inti
| Entitas | Field logis utama |
|---|---|
| Company | id, name, slug, timezone, settings, createdAt, updatedAt |
| Department | id, companyId, name, slug, parentDepartmentId, leadAgentId, floorId, roomId, status |
| Position | id, companyId, title, level, description, permissions |
| Agent | id, companyId, displayName, slug, avatarAssetId, roleTitle, positionId, departmentId, managerAgentId, providerProfileId, skills, status |
| AgentCapability | id, agentId, capability, scope, enabled, policyRef |
| Task | id, companyId, title, description, objective, parentTaskId, createdByActor, ownerAgentId, priority, status, dueAt, idempotencyKey, budget |
| TaskAssignment | id, taskId, agentId, assignmentRole, assignedBy, status, assignedAt, acceptedAt, completedAt |
| TaskDependency | id, taskId, dependsOnTaskId, dependencyType |
| TaskRun | id, taskId, agentId, runtimeId, status, attempt, startedAt, endedAt, errorCode, correlationId, tokenUsage, costEstimate |
| Deliverable | id, taskId, createdByAgentId, title, artifactType, storageRef, version, checksum, reviewStatus |
| Review | id, deliverableId, reviewerAgentId, reviewerUserId, status, feedback, reviewedAt |
| Conversation | id, companyId, conversationType, title, relatedTaskId, createdAt, updatedAt |
| ConversationParticipant | conversationId, participantType, participantId, role, joinedAt, leftAt |
| Message | id, conversationId, senderType, senderId, recipientType, recipientId, messageType, body, metadata, correlationId, createdAt, deliveryStatus |
| A2ASession | id, conversationId, taskId, initiatorAgentId, status, protocol, startedAt, endedAt, correlationId, budget, depth |
| Meeting | id, companyId, title, agenda, status, roomId, organizer, scheduledAt, startedAt, endedAt, relatedTaskId |
| MeetingAttendee | meetingId, attendeeType, attendeeId, attendanceStatus, joinedAt, leftAt |
| MeetingRecord | id, meetingId, recordType, content, author, createdAt, relatedTaskId |
| ApprovalRequest | id, companyId, requestedBy, actionType, resourceType, resourceId, argumentsHash, riskLevel, reason, status, expiresAt, decidedBy, decidedAt |
| Policy | id, companyId, name, version, rules, enabled, updatedAt |
| AuditEvent | id, companyId, actor, action, resourceType, resourceId, result, policyDecision, correlationId, causationId, metadata, occurredAt |

## 3. Office World entities
| Entitas | Field logis utama |
|---|---|
| Building | id, companyId, name, stylePreset, coordinateSystem |
| Floor | id, buildingId, floorCode, name, sortOrder, elevation, visibility |
| Room | id, floorId, roomCode, name, roomType, departmentId, accessPolicyRef, bounds, capacity |
| Workstation | id, roomId, workstationCode, name, position3D, rotation, workstationType, enabled |
| NavigationNode | id, floorId, nodeType, position3D, metadata |
| NavigationEdge | id, fromNodeId, toNodeId, travelCost, accessPolicyRef, enabled |
| AgentPresence | id, agentId, buildingId, floorId, roomId, workstationId, worldPosition, activity, sourceEventId, updatedAt, staleAt |
| Asset | id, assetKey, category, version, filePath, sourceType, license, attribution, metadata, approvalStatus |

AgentPresence adalah projection yang dapat dibangun ulang; bukan sumber kebenaran task/run. Hindari menyimpan koordinat setiap frame.

## 4. Relasi
- Company 1—N Department, Position, Agent, Policy, Building, Task, Meeting.
- Department 1—N Agent; Agent dapat memimpin department.
- Agent 1—N TaskAssignment, TaskRun, Deliverable, Message, AuditEvent.
- Task 1—N Assignment, Run, Deliverable; Task dapat memiliki subtask.
- Conversation 1—N Participant dan Message; A2ASession dapat terkait Task.
- Meeting 1—N Attendee dan MeetingRecord.
- Building 1—N Floor; Floor 1—N Room; Room 1—N Workstation.
- AgentPresence mereferensikan Agent dan lokasi Office World.

## 5. Constraint dan indeks
- Unique companyId+slug untuk department/agent.
- Unique buildingId+floorCode, floorId+roomCode, roomId+workstationCode.
- Index task companyId/status/priority/updatedAt; assignment agentId/status.
- Index message conversationId/createdAt/id.
- Index audit companyId/occurredAt/correlationId.
- Idempotency key unik dalam scope command.
- Cegah task dependency self-reference/cycle.
- Jaga integritas foreign key/reference.

## 6. Lifecycle
Command divalidasi dan diotorisasi → domain record diubah atomik → audit/outbox dicatat → event dipublish → office projection diperbarui → renderer mencerminkan state. Gunakan transaksi/outbox jika storage mendukungnya.

## 7. Migrasi
Dokumen ini tidak menyatakan entitas tersebut sudah ada atau belum ada di source. Inventarisasi interface, JSON files, tables, migrations, API payload, dan tests. Map existing entities ke logical model, pertahankan adapter kompatibilitas selama migrasi. Tidak ada migrasi destruktif tanpa backup, rehearsal, dan rollback.
