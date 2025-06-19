import { useEffect, useRef, useState } from "react";
import { supabase, testDatabaseConnection } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

function randomName() {
  return "User" + Math.floor(Math.random() * 10000);
}

export default function ChatRoom() {
  const [step, setStep] = useState<"start" | "join" | "chat">("start");
  const [roomId, setRoomId] = useState("");
  const [nickname, setNickname] = useState(randomName());
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [roomLink, setRoomLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Test connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await testDatabaseConnection();
      setIsConnected(connected);
      if (!connected) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to the chat server. Please check your internet connection.",
          variant: "destructive",
        });
      }
    };
    checkConnection();
  }, [toast]);

  // Create a room
  const createRoom = async () => {
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Please wait while we connect to the chat server...",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("rooms")
        .insert([{ name: "Chat Room" }])
        .select()
        .single();

      if (error) {
        console.error("Create room error:", error);
        throw error;
      }
      
      if (data) {
        console.log('Room created successfully:', data);
        setRoomId(data.id);
        setRoomLink(window.location.origin + "/chat?room=" + data.id);
        setStep("chat");
        toast({
          title: "Room Created!",
          description: "Share the room link with others to join.",
        });
      }
    } catch (error: any) {
      console.error("Create room error details:", error);
      
      let errorMessage = "Failed to create room. ";
      if (error.message.includes('Failed to fetch')) {
        errorMessage += "Please check your internet connection and try again.";
      } else {
        errorMessage += error.message || "Please try again.";
      }

      toast({
        title: "Error Creating Room",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Join a room
  const joinRoom = async () => {
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Please wait while we connect to the chat server...",
        variant: "destructive",
      });
      return;
    }

    if (!roomId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId.trim())
        .single();

      if (error) {
        console.error("Join room error:", error);
        throw error;
      }

      if (data) {
        setRoomLink(window.location.origin + "/chat?room=" + roomId);
        setStep("chat");
        toast({
          title: "Success!",
          description: "You've joined the room.",
        });
      } else {
        toast({
          title: "Error",
          description: "Room not found. Please check the room ID.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Join room error details:", error);
      toast({
        title: "Error Joining Room",
        description: error.message || "Failed to join room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch and subscribe to messages
  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("room_id", roomId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Fetch messages error:", error);
          throw error;
        }

        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    fetchMessages();

    const channel = supabase
      .channel("room:" + roomId)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages((msgs) => [...msgs, payload.new]);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Successfully subscribed to room:", roomId);
        } else {
          console.error("Failed to subscribe to room:", roomId);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, toast]);

  // Send a message
  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const { error } = await supabase.from("messages").insert([
        {
          room_id: roomId,
          sender: nickname,
          text: message.trim(),
        },
      ]);

      if (error) {
        console.error("Send message error:", error);
        throw error;
      }

      setMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // UI
  if (step === "start") {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-center">Chat Room</CardTitle>
          {!isConnected && (
            <div className="text-sm text-red-500 text-center">
              Connecting to chat server...
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Your Nickname"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
            />
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={createRoom} 
              className="w-full"
              disabled={isLoading || !isConnected}
            >
              {isLoading ? "Creating..." : "Create New Room"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or join existing room
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Enter Room ID"
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
                disabled={!isConnected}
              />
              <Button 
                onClick={joinRoom}
                disabled={isLoading || !isConnected}
              >
                {isLoading ? "Joining..." : "Join"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto flex flex-col h-[80vh] mt-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Chat Room</CardTitle>
        <div className="text-xs text-muted-foreground">
          Room ID: <span className="font-mono">{roomId}</span>
          <br />
          Share this link: <a href={roomLink} className="text-blue-600 underline hover:text-blue-700">{roomLink}</a>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === nickname ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm shadow-sm ${
                msg.sender === nickname
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              }`}>
                <span className="font-bold">{msg.sender}: </span>
                {msg.text}
                <div className="text-xs text-right text-muted-foreground mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="flex gap-2 items-end">
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[40px] max-h-[100px] flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            className="h-fit px-4 py-2" 
            disabled={!message.trim()}
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
