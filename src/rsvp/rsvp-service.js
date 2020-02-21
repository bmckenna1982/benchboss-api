const RsvpService = {
  getRsvpById(db, id) {
    return db
      .from('rsvp as rsvp')      
      .select(
        'rsvp.id',
        'rsvp.game_id',
        'rsvp.game_status',
        'rsvp.response_date',
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'user_name', usr.user_name,
              'full_name', usr.full_name            
            )
          ) AS "user"`
        ),
      )
      .leftJoin(
        'benchboss_user as usr',
        'rsvp.user_id',
        'usr.id',
      )       
      .where('rsvp.id', id)
      .first()
  },
  insertRsvp(db, newRsvp) {
    return db
      .insert(newRsvp)
      .into('rsvp')
      .returning('*')
      .then(([rsvp]) => rsvp)
      .then(rsvp =>
        RsvpService.getRsvpById(db, rsvp.id)
      )
  },
  updateRsvp(db, id, newRsvp) {
    return db
      .from('rsvp')
      .where({ id })
      .update(newRsvp)
  }
}

module.exports = RsvpService