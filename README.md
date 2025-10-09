# Artofolio

A neon-cyberpunk art portfolio to showcase drawings and paintings with tags, comments, search, and a featured gallery. Built with Next.js App Router and Prisma.

## Features
- Admin-only CRUD for artworks (create, edit, delete, feature)
- Public browsing with Featured and Latest sections
- Comments (any signed-in user); author/admin can edit/delete
- Tag + text search across title/description
- Cloudinary image upload and cleanup on delete
- Animated background, cyberpunk UI, responsive grid

## Tech Stack
- Next.js 15 (App Router) + React 19
- NextAuth (GitHub Provider)
- Prisma + PostgreSQL
- Cloudinary (image hosting)
- Tailwind CSS v4

## Admin & Authentication
- Admin is determined by `ADMIN_EMAIL` (or `NEXT_PUBLIC_ADMIN_EMAIL`) in `.env.local`.
- Only the admin can access CRUD actions and mark art as Featured.
- Login via GitHub on `/login` or the header Sign In.
- Admin helpers:
  - `/admin` for shortcuts
  - `/artwork/new` to create
  - `/artwork/[id]/edit` to update

## Getting Started
1. Clone and install
```bash
npm i
```
2. Env setup (`.env.local`)
```bash
DATABASE_URL=postgres://...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
ADMIN_EMAIL=you@example.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```
3. Prisma
```bash
npx prisma generate
# dev sync
npx prisma db push
# or migrations
# npx prisma migrate dev -n init
```
4. Run
```bash
npm run dev
```

## Contributing
Contributions are welcome! Feel free to open issues and PRs.

## License
MIT. See `LICENSE`.

## Screenshots
- Home: Featured + Latest grid
- Artwork Detail: image, tags, comments, actions
- Admin: create/edit forms with Featured toggle

## Feedback
Have ideas or found a bug? Open an issue or reach out via email.

