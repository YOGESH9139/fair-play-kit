from pyteal import *

def approval_program():
    # Global state key
    match_counter = Bytes("match_counter")
    
    @Subroutine(TealType.bytes)
    def get_match_box_name(match_id: Expr):
        return Concat(Bytes("match_"), Itob(match_id))
    
    # On creation of the application
    on_create = Seq([
        App.globalPut(match_counter, Int(0)),
        Approve()
    ])
    
    # Player 1 creates a new match lobby
    create_match = Seq([
        Assert(Txn.application_args.length() == Int(2)),
        App.globalPut(match_counter, App.globalGet(match_counter) + Int(1)),
        # Box size must be exactly 192
        Pop(App.box_create(get_match_box_name(App.globalGet(match_counter)), Int(192))),
        App.box_put(
            get_match_box_name(App.globalGet(match_counter)),
            Concat(
                Txn.sender(),                # Player 1's address (32 bytes)
                Global.zero_address(),       # Player 2 slot is empty (32 bytes)
                Txn.application_args[1],     # Wager amount (8 bytes)
                Itob(Int(0)),                # Initial state is 0 (created) (8 bytes)
                BytesZero(Int(32)),          # p1_commit (32 bytes)
                BytesZero(Int(32)),          # p2_commit (32 bytes)
                Itob(Int(0)),                # p1_move (8 bytes)
                Itob(Int(0)),                # p2_move (8 bytes)
                BytesZero(Int(32))           # winner (32 bytes)
            )
        ),
        Approve()
    ])
    
    # Player 2 joins using ScratchVar
    match_id_sv = ScratchVar(TealType.uint64)
    match_box_name_sv = ScratchVar(TealType.bytes)
    join_match = Seq([
        match_id_sv.store(Btoi(Txn.application_args[1])),
        match_box_name_sv.store(get_match_box_name(match_id_sv.load())),
        Assert(Txn.application_args.length() == Int(2)),
        Assert(App.box_extract(match_box_name_sv.load(), Int(32), Int(32)) == Global.zero_address()),
        Assert(Txn.sender() != App.box_extract(match_box_name_sv.load(), Int(0), Int(32))),
        App.box_replace(match_box_name_sv.load(), Int(32), Txn.sender()),
        Approve()
    ])
    
    # Commit Move
    commit_move = Seq([
        Assert(Txn.application_args.length() == Int(3)),
        If(Txn.sender() == App.box_extract(get_match_box_name(Btoi(Txn.application_args[1])), Int(0), Int(32)))
        .Then(App.box_replace(get_match_box_name(Btoi(Txn.application_args[1])), Int(80), Txn.application_args[2]))
        .Else(App.box_replace(get_match_box_name(Btoi(Txn.application_args[1])), Int(112), Txn.application_args[2])),
        App.box_replace(get_match_box_name(Btoi(Txn.application_args[1])), Int(72), Itob(Int(2))),
        Approve()
    ])
    
    # Reveal Move
    reveal_move = Seq([
        Assert(Txn.application_args.length() == Int(4)),
        Assert(
            Sha256(Concat(Txn.application_args[2], Txn.application_args[3])) ==
            If(Txn.sender() == App.box_extract(get_match_box_name(Btoi(Txn.application_args[1])), Int(0), Int(32)),
                App.box_extract(get_match_box_name(Btoi(Txn.application_args[1])), Int(80), Int(32)),
                App.box_extract(get_match_box_name(Btoi(Txn.application_args[1])), Int(112), Int(32)))
        ),
        If(Txn.sender() == App.box_extract(get_match_box_name(Btoi(Txn.application_args[1])), Int(0), Int(32)))
        .Then(App.box_replace(get_match_box_name(Btoi(Txn.application_args[1])), Int(144), Txn.application_args[2]))
        .Else(App.box_replace(get_match_box_name(Btoi(Txn.application_args[1])), Int(152), Txn.application_args[2])),
        App.box_replace(get_match_box_name(Btoi(Txn.application_args[1])), Int(72), Itob(Int(3))),
        Approve()
    ])
    
    # Resolve Match
    resolve_match = Seq([
        Assert(Txn.application_args.length() == Int(2)),
        App.box_replace(get_match_box_name(Btoi(Txn.application_args[1])), Int(72), Itob(Int(4))),
        Approve()
    ])
    
    # Router
    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.application_args[0] == Bytes("create"), create_match],
        [Txn.application_args[0] == Bytes("join"), join_match],
        [Txn.application_args[0] == Bytes("commit"), commit_move],
        [Txn.application_args[0] == Bytes("reveal"), reveal_move],
        [Txn.application_args[0] == Bytes("resolve"), resolve_match]
    )
    
    return program

def clear_state_program():
    return Approve()

if __name__ == "__main__":
    with open("fair_play_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=8)
        f.write(compiled)
    
    with open("fair_play_clear.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=8)
        f.write(compiled)
    
    print("✅ Contract compiled successfully!")