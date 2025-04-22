<?php

function sendResponse($message = null, $status = 200, $data = null, $errors = null)
{
    $response = [];

    if (isset($message)) {
        $response['message'] = $message;
    }

    if (isset($status)) {
        $response['status'] = $status;
    }

    if (isset($data)) {
        $response['data'] = $data;
    }

    if (isset($errors)) {
        $response['errors'] = $errors;
    }

    return response()->json($response, $status);
}
