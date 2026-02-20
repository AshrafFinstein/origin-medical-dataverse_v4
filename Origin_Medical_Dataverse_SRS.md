# Origin Medical – Dataverse (SRS Descriptions)

## Image Approval Workflow (L1–L5)

- The system shall support an image approval workflow across up to five approval levels (L1–L5). Each approval level may include multiple users and user groups.
- The system shall allow users to edit or modify images only when the image is available in their current workflow level. Once an image moves to another approval level, it shall become non-editable for the previous level and remain accessible only at the currently active level.
- Before sending images to Level 1, the system shall keep images at the Assignee level in Pending status and allow them to remain editable. After the user clicks Send for QC, the image shall move to Approval Level 1.
- The system shall allow Approval Level 1, 2, and 5 users to access their assigned QC workflow and perform review actions, including Accept and Reject.
- If an image is rejected at any approval level, the system shall move it back to the previous approval level and mark it as Rejected, allowing users at that level to correct and resubmit it.
- If an image is accepted at a non-final approval level, the system shall move it to the next approval level, and the image shall remain editable only for the new active level.
- The system shall allow Final Approval users to access and review images in IN_REVIEW status. Once accepted, images shall be marked as ACCEPTED and remain visible to all approval levels.
- The system shall ensure smooth performance when loading images, session details, and executing approval actions across all levels. After Accept or Reject actions, the system shall update image states without noticeable delay.
- The system shall provide a clear and consistent interface across Assignee and Approval levels, including visible image statuses, approval level indicators, and smooth session navigation.

---

## Analysis Modal – Data Labelling

- The system shall provide an interactive Analyze icon/button within each row of the Data Labelling Session table. Clicking this button shall open the Analysis Modal for the selected session.
- The Analysis Modal shall include:
  - A header displaying the session name
  - A close (“X”) button
  - Three tabs: Label Analysis, Annotation Analysis, and Status Analysis
- Upon opening, the system shall default to the Label Analysis tab and immediately trigger data retrieval for that view.
- The system shall group data by unique combinations of labels assigned to resources and display the total count for each combination (example: “2D, 3D” shown as a single row).
- The system shall display annotation class counts, differentiating between:
  - Parent annotations
  - Child taxonomies / attributes
- The system shall aggregate status data. For IN_REVIEW and REJECTED, the system shall append the approval level (L1–L5). The system shall also track PENDING status specifically for images.
- The system shall execute the following queries in parallel to minimize wait time:
  - Main Data Query
  - Total Count Query (pagination support)
  - Filter Options Query
- The system shall support pagination with user-selected page sizes (10, 20, 30) and Next/Previous navigation controls.
- The system shall allow users to sort the Count and Name columns. Sorting must apply to the entire dataset (server-side), not only the visible page.
- The system shall provide column-level filters with:
  - Search bar
  - Select All option
  - Checkbox list of unique values
- Upon confirmation, the system shall update the data table immediately based on selected filters.
- The system shall cache filter option lists for 5 minutes to prevent redundant requests when reopening filters.
- The system shall restrict filter dropdown rendering to a maximum of 1000 items to avoid browser performance issues.
- If results are empty, the system shall display a clean No Data message. If a network/server error occurs, the system shall display a Failed to fetch toast message.

---

## Approval Level Configuration – Session Creation

- The system shall allow only Reviewer users to configure approval levels during session creation.
- By default, the Approval Level section shall show only an Add Level action. If no reviewer role is available, users shall not be able to access approval configuration.
- When Add Level is clicked, the system shall display Level 1 as the mandatory first level. The system shall require a valid Level 1 approver selection and block session submission if Level 1 is not configured.
- The system shall allow users to add multiple approval levels sequentially from Level 1 to Level 5, where each level represents the next workflow stage.
- The system shall allow users to remove approval levels using the Remove (–) icon. Approval levels can be modified or deleted only before the session is submitted or updated.
- The system shall restrict approval level configuration actions to authorized Reviewer users only. Non-reviewer users shall not be able to view, add, edit, or delete approval levels.
- The system shall load approval configuration fields without noticeable delay and provide a clear, intuitive interface for managing levels, approvers, and actions.

---

## Image Grid + Filters + Freeze

- The system shall display a responsive grid of ultrasound images, showing unique identifiers and annotation status overlays.
- The system shall allow users to select single or multiple images for batch operations, with clear visual distinction for selected items.
- The system shall allow users to apply diagnostic labels to selected images via a multi-select dropdown and update metadata immediately upon confirmation.
- The system shall provide pagination controls, allowing users to adjust items per page, jump to pages, and view total counts.
- The system shall allow users to search for images using a unique Image ID and filter the grid accordingly.
- When no results are found, the system shall display a clear empty state.
- The system shall allow users to freeze and unfreeze grid interaction to prevent accidental changes during review.
- The system shall render the grid and update state within 2 seconds for datasets up to 200 items per page, with seamless transitions between pages.
- The system shall restrict labeling and Send for QC actions based on role permissions and continuously display the current user for audit safety.

---

## Session Label Master

- The system shall provide a Session Label page where authorized users can view, search, and manage labels, including a header, search field, Create button, and label table.
- The system shall allow users to create a Session Label through a popup with mandatory fields.
- The system shall validate the Name field as mandatory, prevent empty/space-only values, restrict invalid special characters, and enforce a maximum character limit.
- The system shall allow users to enter a Description with a defined maximum character limit.
- The system shall allow users to select a color using a Color Picker. The default color shall be white.
- The system shall allow users to cancel or close the popup without saving, discarding unsaved changes. When editing, existing values shall be prefilled.
- The system shall display Session Label dropdown values during session creation and update dynamically when new labels are created. Users may remove labels if not required.
- The system shall restrict Session Label dropdown access to authorized session-creation users only.
- The system shall ensure the dropdown loads within acceptable response time and provides clear selection feedback.
- If results are empty, the system shall display a No Data message. If a server/network error occurs, the system shall show a Failed to fetch toast message.

---

## Dataverse Multi-Bucket Support

- The system shall support centralized registration of multiple S3 buckets with provider metadata and access configuration.
- The system shall automatically resolve the correct storage bucket for each asset without manual selection.
- The system shall associate each labeling session with one or more resolved buckets automatically and maintain bucket association at the asset level.
- The system shall route storage operations through provider-specific adapters and process all assets through a unified pipeline regardless of bucket origin.
- The system shall render PNG images across buckets and generate secure, time-bound signed URLs for cross-bucket access.
- The system shall isolate credentials per bucket and prevent cross-bucket credential misuse.
- The system shall record logs, metrics, and traces for multi-bucket operations and display appropriate error messages when failures occur.

---

## Create Session Fields

The system shall provide inputs and dropdowns to capture session metadata, including:

- Session Name (mandatory with naming convention support)
- Session Description (multi-line)
- Organizational tags
- Lifecycle state
- Master Project, Sub-Project, Use Case
- View plane, Center, User Type
- Image count, Batch grouping
- Session ID generation trigger
- External reference links (Name + URL, deletable)

The system shall provide multi-select dropdowns for:

- Assignee selection (with Select All)
- Reviewer selection (with Select All)

The system shall provide controls for:

- Approval Level configuration
- Global taxonomy selection and filtering
- Bulk import from CSV
- JSON upload during session creation

---

## Session Creation – JSON Upload

- The system shall allow users to upload JSON files during session creation to configure session metadata and labeling inputs.
- The system shall enforce role-based access so only authorized users can access the Session Creation page.
- The system shall open session creation in a separate page while preserving the user’s workspace context.
- The system shall ensure fast loading and JSON upload readiness without blocking navigation.
- The system shall handle empty file selection, invalid JSON, and server errors gracefully with clear user-friendly messages.
- The system shall support multiple JSON uploads with drag-and-drop and click-to-upload capability, showing a list of selected files before import.
- The system shall detect duplicate images within uploaded JSON files and prompt the user before proceeding.
- The system shall update the image grid within 3 seconds after confirmation and display a loading spinner during processing.
- The system shall restrict uploads to .json files only and allow users to remove selected files before upload, updating the file count dynamically.
- The system shall display uploaded JSON file names below the upload area and show a success toast when processing completes.
- The system shall provide immediate feedback for uploaded, failed, and pending files and ensure responsiveness during validation and upload.

---

## Lock/Unlock Annotations

- The system shall ensure consistent annotation controls by displaying Lock and Unlock icons.
- The system shall display annotation controls only after at least one annotation exists.
- The system shall prevent movement or resizing of locked annotations until unlocked.
- The system shall allow locking/unlocking at both:
  - Individual annotation level
  - Overall image level
- The system shall support keyboard shortcuts:
  - **L** to lock/unlock selected annotation
  - **Ctrl + L** to lock/unlock all annotations

---

## Role-Based Dataverse REST APIs

- The system shall provide role-based REST APIs to retrieve:
  - Session-level details
  - Session name
  - Patient ID count (without exposing identifiers)
  - Image count
  - Taxonomy export
  - Label export (downstream-ready format)

---

## Undo / Redo + Deletion

- The system shall allow Undo for the most recent unsaved annotation change.
- The system shall allow Redo until a new action is performed or Save is triggered.
- The system shall update Undo/Redo button states dynamically and disable them after Save.
- The system shall clear history stacks after successful save.
- The system shall map Backspace as a deletion shortcut:
  - If no canvas selection → Remove Labels confirmation
  - If canvas object selected → Delete Annotation Marks confirmation
- The system shall display a standardized Yes/No confirmation modal for deletion actions.

---

## Version Tracker – JSON Download Versions

- The system shall assign sequential version numbers for each generated JSON.
- The system shall store JSON versions as immutable history (no overwrite or delete).
- The system shall retrieve and display version history with metadata:
  - Version number
  - Creation date/time
  - Generated by user
- The system shall allow only one version selection at a time and enable download only after selection.
- The system shall validate user authorization before download and ensure downloads are reliable and uncorrupted.
- The system shall support large version history lists without performance degradation.

---

## Epic – Delete Session Request Workflow

- The system shall display the Delete Session button only for users with delete permission.
- The system shall show a red badge on Delete Session Requests, indicating pending request count.
- The system shall allow authorized users to submit deletion requests with mandatory reason.
- The system shall provide an admin dashboard listing deletion requests with requester details, reason, and status.
- The system shall allow administrators to approve requests (permanent deletion) or reject requests (optional reason, session remains active).
- The system shall enforce role-based access for all delete request actions.

---

## Master Validation Rules

The system shall enforce validation rules for all master entities including:

- Label
- Annotation
- Session Label
- User Group
- Structure Group
- Session Codes
- Epic
- Project
- Session

Validation includes:

- Mandatory Name fields
- Max character limits
- Input format restrictions
- Unique name enforcement
- Mandatory abbreviation where applicable
- Role and approval level constraints
- JSON upload validations (file type, structure, duplicates, empty files)

---

## Session Status Rules

- The system shall display predefined Session Status values.
- During Create Session, only Yet to Do and In Progress shall be selectable; Completed and Re-open shall be disabled by default.
- The system shall set Yet to Do as default when opening Create Session.
- The system shall allow changing status to In Progress when work begins and Completed after work is finished.
- The system shall display Yet to Do in red and In Progress in blue.

---

## Annotation Label Apply via Right-Click

- The system shall display a label selection popup when users right-click an image on the Annotation page.
- The popup shall include:
  - Search field
  - Label list with checkboxes
  - Apply button (disabled until at least one label selected)
- The system shall allow selecting multiple labels and applying them with confirmation feedback.
- The system shall allow removing labels using Backspace with confirmation popup and success message.
- The system shall enforce role-based authorization for label assignment/removal actions.
- The system shall ensure fast response and usability across the labeling workflow.

---

## S3 Upload + Push Options

- The system shall allow Upload from S3 during session creation.
- The system shall validate that the entered S3 path is a valid S3 key and not a public URL.
- If the folder does not exist, the system shall prompt for confirmation before creating it.
- The system shall allow Push to S3 for downloaded session JSON.
- The system shall show success notifications for S3 upload/push actions.
- The system shall restrict S3 actions based on role permissions.
- The system shall ensure S3 operations complete within acceptable performance limits.
- The system shall provide tooltips and guidance to improve usability.

---

## Copy Annotation

- The system shall enable Copy Annotation only when the selected image has at least one saved annotation.
- The system shall allow copying annotations to the next image or previous image using:
  - Copy Annotation option
  - Shift + Ctrl + Right Arrow
  - Shift + Ctrl + Left Arrow
- If target image already has annotations, the system shall show Existing Annotations Found popup with Cancel and Replace options.

---

## Session Lock / Unlock

- The system shall enable or disable Session Lock based on Lock permission.
- The system shall display a Lock icon for sessions marked Completed.
- The system shall require a mandatory reason to lock a session.
- The system shall prevent Edit and Delete actions when locked but allow Duplicate.
- The system shall allow authorized users to unlock sessions with a reason.
- The system shall display Lock icon disabled for users without permission.
- The system shall prevent unauthorized modification of locked sessions through any method.
- Lock/unlock actions must complete without noticeable delay and remain clearly visible.
