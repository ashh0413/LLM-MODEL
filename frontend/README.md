# MiniMind Frontend

A Next.js application for the MiniMind LLM project.

## Deployment

This project is configured for deployment on [Vercel](https://vercel.com).

### Quick Deploy

```bash
cd frontend
vercel
```

### Environment Variables

Configure these in your Vercel project dashboard:

| Variable | Description | Required |
|----------|-------------|----------|
| `CLAUDE_API_KEY` | API key from codemax.pro | Yes |
| `HUGGINGFACE_API_KEY` | HuggingFace inference token | No |
| `HUGGINGFACE_MODEL_ID` | Model ID (default: gpt2) | No |

### GitHub Integration

The project includes automatic deployment via GitHub Actions:

1. Push to `master` or `main` → Production deployment
2. Open a PR → Preview deployment
3. PR merged → Production deployment

#### Setup GitHub Secrets

In your GitHub repository, add these secrets:

1. Go to **Settings → Secrets and variables → Actions**
2. Add `VERCEL_TOKEN` (from [vercel.com/tokens](https://vercel.com/tokens))
3. Add `VERCEL_ORG_ID` (from Vercel team settings)
4. Add `VERCEL_PROJECT_ID` (from Vercel project settings)

#### Generate Vercel Tokens

1. Go to [vercel.com/tokens](https://vercel.com/tokens)
2. Create a new token with deployment permissions
3. Copy the token value

Your `VERCEL_ORG_ID` can be found in your Vercel team or personal settings.

## Development

```bash
npm install
npm run dev
```

## API Routes

- `/api/claude` - Claude API proxy
- `/api/huggingface` - HuggingFace inference
- `/api/model-info` - Model information
