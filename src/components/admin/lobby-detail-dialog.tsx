"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Clock, MessageSquare } from "lucide-react"
import { StatusBadge, GameModeBadge } from "@/lib/admin/lobby-utils"
import { useScopedI18n } from "@/locales/client"
import type { DetailedLobby } from "@/lib/admin/lobby-types"

interface LobbyDetailDialogProps {
  lobby: DetailedLobby | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LobbyDetailDialog({ lobby, open, onOpenChange }: LobbyDetailDialogProps) {
  const t = useScopedI18n("admin.lobbies")

  if (!lobby) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lobby.name}</DialogTitle>
          <DialogDescription>{t("details.subtitle")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lobby Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("details.host")}</Label>
              <p className="text-sm">{lobby.host.name || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground">{lobby.host.email}</p>
            </div>
            <div>
              <Label>{t("details.status")}</Label>
              <div className="mt-1"><StatusBadge status={lobby.status} /></div>
            </div>
            <div>
              <Label>{t("details.mode")}</Label>
              <div className="mt-1"><GameModeBadge mode={lobby.gameMode} /></div>
            </div>
            <div>
              <Label>{t("details.rounds")}</Label>
              <p className="text-sm">{lobby.currentRound}/{lobby.rounds}</p>
            </div>
          </div>

          {/* Players Leaderboard */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {t("details.leaderboard")}
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("details.rank")}</TableHead>
                  <TableHead>{t("details.player")}</TableHead>
                  <TableHead>{t("details.score")}</TableHead>
                  <TableHead>{t("details.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lobby.players.map((player, index) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-bold">
                      {index === 0 && <Trophy className="h-4 w-4 text-yellow-500 inline mr-2" />}
                      #{index + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{player.username}</div>
                        {player.user && (
                          <div className="text-xs text-muted-foreground">{player.user.email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{player.score} pts</TableCell>
                    <TableCell>
                      {player.isEliminated && <Badge variant="destructive">{t("details.eliminated")}</Badge>}
                      {player.isReady && !player.isEliminated && <Badge variant="secondary">{t("details.ready")}</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Game Rounds */}
          {lobby.gameRounds.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t("details.rounds")}
              </h3>
              <div className="space-y-4">
                {lobby.gameRounds.map((round) => (
                  <Card key={round.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {t("details.round")} {round.roundNumber}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <span className="font-semibold">{t("details.correctYear")}:</span> {round.image.year}
                      </div>
                      {round.guesses.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold mb-2">{t("details.guesses")}:</p>
                          <div className="space-y-1">
                            {round.guesses.map((guess) => (
                              <div key={guess.id} className="text-sm flex justify-between">
                                <span>{guess.player.username}: {guess.year}</span>
                                <span className="text-muted-foreground">
                                  {guess.points + guess.speedBonus} pts
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {lobby.chatMessages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {t("details.chat")}
              </h3>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {lobby.chatMessages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <span className="font-semibold">{msg.username}:</span>{" "}
                    <span className={msg.type === "SYSTEM" ? "text-muted-foreground italic" : ""}>
                      {msg.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
