/**
 * Auth API
 * 로그인 및 JWT 토큰 관련 API 클라이언트
 */

import { apiFetch } from "./client";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  username: string;
  display_name: string;
}

export async function login(data: LoginRequest): Promise<TokenResponse> {
  return apiFetch<TokenResponse>("/api/v1/auth/login", {
    method: "POST",
    body: data,
  });
}
