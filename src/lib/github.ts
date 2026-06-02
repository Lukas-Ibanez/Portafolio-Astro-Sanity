export type GithubRepo = {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  pushedAt: string;
  stars: number;
};

const token = import.meta.env.GITHUB_TOKEN;
const username = import.meta.env.GITHUB_USERNAME || 'TODO-lukas-github';

export async function getFeaturedRepos(): Promise<GithubRepo[]> {
  if (!token || username.startsWith('TODO')) return [];

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=6`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'lukas-ibanez-portfolio-build',
      },
    });

    if (!response.ok) return [];

    const repos = await response.json();
    return repos
      .filter((repo: any) => !repo.fork)
      .slice(0, 4)
      .map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        pushedAt: repo.pushed_at,
        stars: repo.stargazers_count,
      }));
  } catch {
    return [];
  }
}
