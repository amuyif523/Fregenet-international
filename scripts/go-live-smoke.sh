#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: bash scripts/go-live-smoke.sh https://your-domain.example"
  exit 1
fi

BASE_URL="${1%/}"

echo "Smoke checking: $BASE_URL"

check_status() {
  local url="$1"
  local expected="$2"
  local code
  code="$(curl -s -o /dev/null -w "%{http_code}" "$url")"
  if [[ "$code" != "$expected" ]]; then
    echo "FAIL: $url expected $expected got $code"
    return 1
  fi
  echo "OK:   $url -> $code"
}

check_one_of() {
  local url="$1"
  shift
  local code
  code="$(curl -s -o /dev/null -w "%{http_code}" "$url")"
  for expected in "$@"; do
    if [[ "$code" == "$expected" ]]; then
      echo "OK:   $url -> $code"
      return 0
    fi
  done
  echo "FAIL: $url expected one of [$*] got $code"
  return 1
}

check_status "$BASE_URL/" 200
check_status "$BASE_URL/projects" 200
check_status "$BASE_URL/governance" 200
check_status "$BASE_URL/transparency" 200
check_status "$BASE_URL/newsletter" 200
check_status "$BASE_URL/login" 200
check_one_of "$BASE_URL/admin/dashboard" 307 308

echo "All smoke checks passed."
