<?php

namespace App\Http\Controllers;

use App\Services\PokeApiService;
use Illuminate\Http\Request;

class PokemonController extends Controller
{
    public function index(Request $request, PokeApiService $pokeApi)
    {
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 20);

        $page = max(1, $page);
        $limit = min(max(1, $limit), 50);

        return response()->json(
            $pokeApi->getPokemons($page, $limit)
        );
    }
}
