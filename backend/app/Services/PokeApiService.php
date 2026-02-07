<?php

namespace App\Services;

use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;

class PokeApiService
{
    private string $baseUrl = 'https://pokeapi.co/api/v2';

    public function getPokemons(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;

        $list = Http::get("{$this->baseUrl}/pokemon", [
            'limit' => $limit,
            'offset' => $offset,
        ])->throw()->json();

        $results = $list['results'] ?? [];

        $detailResponses = Http::pool(function (Pool $pool) use ($results) {
            foreach ($results as $item) {
                $pool->get($item['url']);
            }
        });

        $merged = [];
        foreach ($detailResponses as $resp) {
            if (!$resp->successful()) {
                continue;
            }

            $d = $resp->json();

            $types = [];
            foreach (($d['types'] ?? []) as $t) {
                $types[] = $t['type']['name'] ?? null;
            }
            $types = array_values(array_filter($types));

            $merged[] = [
                'name' => $d['name'] ?? null,
                'image' => $d['sprites']['other']['official-artwork']['front_default'] ?? null,
                'types' => $types,
                'height' => $d['height'] ?? null,
                'weight' => $d['weight'] ?? null,
            ];
        }

        return $merged;
    }
}
