<?php

namespace App\Exceptions;


use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use League\OAuth2\Server\Exception\OAuthServerException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthorizationException::class,
        OAuthServerException::class,
//        HttpException::class,
//        ModelNotFoundException::class,
        ValidationException::class,
        ValidationError::class
    ];

    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * @param Throwable $exception
     *
     * @throws Throwable
     */
    public function report(Throwable $exception)
    {
        if ($this->shouldReport($exception) && app()->bound('sentry')) {
            app('sentry')->captureException($exception);
        }

        parent::report($exception);
    }

    /**
     * @param Request   $request
     * @param Throwable $e
     *
     * @return JsonResponse|Response
     * @throws Throwable
     */
    public function render($request, Throwable $e)
    {
        if (env('APP_DEVELOPER_MODE')) {
            return parent::render($request, $e);
        }
        if ($e instanceof ValidationError) {
            return $e->getResponse();
        }

        if ($e instanceof NotFoundHttpException) {
            return response()->view('errors.404', [], 404);
        }

        if ($e instanceof QueryException) {
            return response()->json([
                'errors' => 'Sorry, something went wrong.',
                'message' => 'Sorry, something went wrong.',
            ], 400);
        }

        if ($e instanceof ModelNotFoundException) {
            return response()->json([
                'errors' => 'The resource you are requesting does not exist',
                'message' => 'The resource you are requesting does not exist',
            ], 404);
        }

        if ($e instanceof AuthenticationException) {
            return response()->json([
                'errors' => 'Unauthorized',
                'message' => 'Unauthorized'
            ], 401);
        }

        // Define the response
        $response = [
            'errors' => 'Sorry, something went wrong.'
        ];

        $response['message'] = $e->getMessage();

        // Default response of 400
        $status = 400;

        // If this exception is an instance of HttpException
        if ($this->isHttpException($e)) {
            // Grab the HTTP status code from the Exception
            $status = $e->getStatusCode();
        }

        // Return a JSON response with the response array and status code
        return response()->json($response, $status);
    }
}
