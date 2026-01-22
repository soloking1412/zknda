// The 'test_zknda' test program.
import zknda.aleo;
program test_zknda.aleo {
    @test
    script test_it() {
        let result: u32 = zknda.aleo/main(1u32, 2u32);
        assert_eq(result, 3u32);
    }

    @test
    @should_fail
    transition do_nothing() {
        let result: u32 = zknda.aleo/main(2u32, 3u32);
        assert_eq(result, 3u32);
    }

    @noupgrade
    async constructor() {}
}
