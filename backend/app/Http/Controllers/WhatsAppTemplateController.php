<?php
namespace App\Http\Controllers;

use App\Models\WhatsAppTemplate;
use Illuminate\Http\Request;

class WhatsAppTemplateController extends Controller
{
    public function index()
    {
        $data = WhatsAppTemplate::where('active', true)->get();
        return sendResponse("Whatsapp Template Returned Successfully", 200 ,$data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|unique:whatsapp_templates,key',
            'message' => 'required|string',
            'active' => 'boolean',
        ]);
        $template = WhatsAppTemplate::create($validated);
        return sendResponse("Whatsapp Template Created Successfully", 200 ,$template);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|exists:whatsapp_templates,key',
            'message' => 'nullable|string',
            'active' => 'nullable|boolean',
        ]);
        $template = WhatsAppTemplate::where('key', $validated['key'])->first();
        if (isset($validated['message'])) {
            $template->message = $validated['message'];
        }
        if (isset($validated['active'])) {
            $template->active = $validated['active'];
        }
        $template->save();
        return sendResponse("Whatsapp Template Updated Successfully", 200 ,$template);
    }
}
