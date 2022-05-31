<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Message\StoreRequest;
use App\Http\Resources\ChatResource;
use App\Http\Resources\ChatsResource;
use App\Models\Chat;
use App\Repositories\MessageRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{

    public function __construct(public MessageRepository $messageRepository)
    {
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function getByParticipants(Request $request): JsonResponse
    {
        $chats = Chat::with('participants')->whereHas('participants', function ($query) {
             $query->where('user_id', auth()->id());
        })->get();

        return response()->json(new ChatsResource($chats));
    }

    /**
     * @param Request $request
     * @param Chat $chat
     * @return JsonResponse
     */
    public function show(Request $request, Chat $chat): JsonResponse
    {
        return response()->json(new ChatResource($chat->refresh()));
    }

    /**
     * @param StoreRequest $request
     * @return JsonResponse
     */
    public function createMessage(StoreRequest $request): JsonResponse
    {
        $input = $request->input();
        $participants = [];
        $participants[] = auth()->id();
        $participants[] = $input['to_user_id'];
        $chat = Chat::with('participants')->whereHas('participants', function ($query) use ($participants) {
            foreach ($participants as $participant) {
                $query->where('user_id', $participant);
            }
        })->first();

        if(!$chat) {
            $chat = Chat::create();
            $chat->participants()->sync($participants);
        }
        $this->messageRepository->create($input + ['chat_id' => $chat->id, 'from_user_id' => auth()->id()]);

        return response()->json(new ChatResource($chat->refresh()));
    }

    /**
     * @param Chat $chat
     * @return JsonResponse
     */
    public function readChat(Chat $chat): JsonResponse
    {
        $chat->messages()->where("to_user_id", auth()->id())->where('viewed', 0)->update(['viewed' => true]);
        return response()->json(true);
    }

}
